package com.suchorit.NeurofleetLoginBack.controller;


import com.suchorit.NeurofleetLoginBack.model.DriverData;
import com.suchorit.NeurofleetLoginBack.service.JwtService;
import com.suchorit.NeurofleetLoginBack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/driver")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String,String>> signup(@RequestBody DriverData user){
        return userService.signup(user);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> logIn(@RequestBody DriverData user){
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
    public ResponseEntity<DriverData> getProfile(@RequestHeader("Authorization") String authHeader){
        return userService.getprofile(authHeader);
    }

    @PostMapping("/getProfile")
    public ResponseEntity<DriverData> getProf(@RequestParam("license") String license){
        return userService.getprof(license);
    }

}
