package com.suchorit.NeurofleetLoginBack.controller;


import com.suchorit.NeurofleetLoginBack.model.FleetManagerData;
import com.suchorit.NeurofleetLoginBack.model.OverSpeedingData;
import com.suchorit.NeurofleetLoginBack.model.ShowVehicle;
import com.suchorit.NeurofleetLoginBack.model.Vehicle;
import com.suchorit.NeurofleetLoginBack.service.JwtService;
import com.suchorit.NeurofleetLoginBack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/fleetManager")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String,String>> signup(@RequestBody FleetManagerData user){
        return userService.signup(user);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> logIn(@RequestBody FleetManagerData user){
        return userService.login(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String,String>> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Map<String,String> response=new HashMap<>();
        if (jwtService.invalidateToken(token)) {
            response.put("message","Logout successful");
            return ResponseEntity.ok(response);
        } else {
            response.put("message","Invalid token or already logged out");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/profile")
    public ResponseEntity<FleetManagerData> getProfile(@RequestHeader("Authorization") String authHeader){
        return userService.getprofile(authHeader);
    }

    @PostMapping("/addVehicle")
    public ResponseEntity<Vehicle> addVehicle
            (@RequestHeader("Authorization") String authHeader, @RequestBody Vehicle vehicle){
        return userService.addVehicle(authHeader,vehicle);
    }
    @PostMapping("/updateVehicle")
    public ResponseEntity<Vehicle> updateVehicle
            (@RequestParam String regNo, @RequestParam double fuel){
        return userService.updateVehicle(regNo,fuel);
    }
    @PostMapping("/seeVehicles")
    public ResponseEntity<List<ShowVehicle>> seeVehicles(@RequestHeader("Authorization") String authHeader){
        return userService.getVehicles(authHeader);
    }
    @PostMapping("/seeVehicle")
    public ResponseEntity<ShowVehicle> seeVehicle(@RequestParam("regNo") String regNo){
        return userService.getVehicle(regNo);
    }
    @PostMapping("/deleteVehicle")
    public ResponseEntity<Map<String,String>> deleteVehicle(@RequestParam("regNo") String regNo){
        return userService.deleteVehicle(regNo);
    }
    @PostMapping("/overSpeeding")
    public ResponseEntity<Map<String,String>> overSpeeding(@RequestBody OverSpeedingData overSpeedingData){
        return userService.overSpeeding(overSpeedingData);
    }
}
