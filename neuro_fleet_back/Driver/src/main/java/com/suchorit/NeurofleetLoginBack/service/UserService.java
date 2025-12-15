package com.suchorit.NeurofleetLoginBack.service;


import com.suchorit.NeurofleetLoginBack.model.DriverData;
import com.suchorit.NeurofleetLoginBack.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {
    @Autowired
    UserRepo userRepo;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtService jwtService;

    private BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

    public ResponseEntity<Map<String,String>> signup(DriverData driverData) {
        Map<String, String> response=new HashMap<>();
        try {
            driverData.setPassword(encoder.encode(driverData.getPassword()));
            if(!userRepo.existsById(driverData.getEmail()) &&
                    !userRepo.existsByLicenseNumber(driverData.getLicenseNumber())){
                userRepo.save(driverData);
                response.put("Message","Account created Successfully");
            }
            else response.put("Message","Account Already exist");
        }catch (Exception e){
            response.put("Message",e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, String>> login(DriverData user) {
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
    public ResponseEntity<DriverData> getprofile(String authHeader) {
        try{
            String token=authHeader.substring(7);
            String email= jwtService.extractUserName(token);
            DriverData userData=userRepo.findByemail(email);
            userData.setPassword("**********");
            return ResponseEntity.ok(userData);
        }catch (Exception e){
            return new ResponseEntity<>(new DriverData(),HttpStatus.NO_CONTENT);
        }
    }

    public ResponseEntity<DriverData> getprof(String license) {
        try {
            return ResponseEntity.ok(userRepo.findByLicenseNumber(license));
        }catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(new DriverData());
        }
    }
}
