package com.suchorit.NeurofleetLoginBack.service;


import com.suchorit.NeurofleetLoginBack.controller.DriverFeign;
import com.suchorit.NeurofleetLoginBack.model.*;
import com.suchorit.NeurofleetLoginBack.repo.OverSpeedingRepo;
import com.suchorit.NeurofleetLoginBack.repo.UserRepo;
import com.suchorit.NeurofleetLoginBack.repo.VehicleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    @Autowired
    UserRepo userRepo;
    @Autowired
    VehicleRepo vehicleRepo;
    @Autowired
    OverSpeedingRepo overSpeedingRepo;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtService jwtService;
    @Autowired
    DriverFeign driverFeign;

    private BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

    public ResponseEntity<Map<String,String>> signup(FleetManagerData fleetManagerData) {
        Map<String, String> response=new HashMap<>();
        try {
            fleetManagerData.setPassword(encoder.encode(fleetManagerData.getPassword()));
            if(!userRepo.existsById(fleetManagerData.getEmail())){
                userRepo.save(fleetManagerData);
                response.put("Message","Account created Successfully");
            }
            else response.put("Message","Account Already exist");
        }catch (Exception e){
            response.put("Message",e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, String>> login(FleetManagerData user) {
        Map<String, String> response=new HashMap<>();
        try {
            Authentication auth=authenticationManager.
                    authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword()));
            if(auth.isAuthenticated()){
                response.put("Message", jwtService.generateToken(user.getEmail()));
                return ResponseEntity.ok(response);
            }
        }
        catch (BadCredentialsException bd){
            response.put("Message","Invalid Credential");
        }
        catch (Exception e){
            response.put("Message",e.getMessage());
        }
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
    public ResponseEntity<FleetManagerData> getprofile(String authHeader) {
        try{
            String token=authHeader.substring(7);
            String email= jwtService.extractUserName(token);
            FleetManagerData userData=userRepo.findByemail(email);
            userData.setCompanyName(userData.getCompanyName());
            userData.setPassword("**********");
            return ResponseEntity.ok(userData);
        }catch (Exception e){
            return new ResponseEntity<>(new FleetManagerData(),HttpStatus.NO_CONTENT);
        }
    }

    public ResponseEntity<Vehicle> addVehicle(String authHeader, Vehicle vehicle) {
        String token=authHeader.substring(7);
        String email= jwtService.extractUserName(token);
        vehicle.setEmail(email);
        try {
            vehicleRepo.save(vehicle);
        }catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(new Vehicle());
        }
        return ResponseEntity.ok(vehicle);
    }

    public ResponseEntity<List<ShowVehicle>> getVehicles(String authHeader) {
        String token=authHeader.substring(7);
        String email= jwtService.extractUserName(token);
        List<Vehicle> vehicles=new ArrayList<>();
        List<ShowVehicle> showVehicles=new ArrayList<>();
        try {
            vehicles=vehicleRepo.findAllByEmail(email);
            for (Vehicle vehicle:vehicles){
                showVehicles.add(getVehicle(vehicle.getRegNo()).getBody());
            }
        }catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(new ArrayList<>(),HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(showVehicles);
    }

    public ResponseEntity <ShowVehicle> getVehicle(String regNo) {
        ShowVehicle showVehicle=new ShowVehicle();
        try {
            Vehicle vehicle=vehicleRepo.findById(regNo).orElse(new Vehicle());

            if(vehicle==null) return new ResponseEntity<>(showVehicle,HttpStatus.NO_CONTENT);
            showVehicle.setRegNo(vehicle.getRegNo());
            showVehicle.setEmail(vehicle.getEmail());
            showVehicle.setName(vehicle.getName());
            showVehicle.setLocation(vehicle.getLocation());
            showVehicle.setFuel(vehicle.getFuel());
            showVehicle.setType(vehicle.getType());
            showVehicle.setStatus(vehicle.getStatus());
            showVehicle.setDistanceCovered(vehicle.getDistanceCovered());

            DriverData driverData=driverFeign.getProf(vehicle.getLicenseNo()).getBody();
            showVehicle.setDriverName(driverData.getName());
            showVehicle.setDriverContact(driverData.getPhNo());
        }catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(showVehicle,HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok(showVehicle);
    }

    public ResponseEntity<Map<String, String>> deleteVehicle(String regNo) {
        Map<String, String> response=new HashMap<>();
        try {
            vehicleRepo.deleteById(regNo);
            response.put("message","Deleted Successfully");
        }catch (Exception e){
            response.put("error",e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Vehicle> updateVehicle(String regNo, double fuel) {
        Vehicle vehicle=vehicleRepo.findById(regNo).orElse(new Vehicle());
        vehicle.setFuel(fuel);
        vehicle.setDistanceCovered(vehicle.getDistanceCovered()+50);
        try {
            if((int)vehicle.getFuel()<=0){
                vehicle.setFuel(0);
                vehicle.setStatus("Maintenance");
            }
            vehicleRepo.save(vehicle);
        }catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(new Vehicle());
        }
        return ResponseEntity.ok(vehicle);
    }


    public ResponseEntity<Map<String, String>> overSpeeding(OverSpeedingData overSpeedingData) {
        Map<String, String> response=new HashMap<>();
        try{
            overSpeedingRepo.save(overSpeedingData);
            response.put("message","Successfully");
        }catch (Exception e){
            response.put("message",e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
}
