package com.suchorit.NeurofleetLoginBack.controller;


import com.suchorit.NeurofleetLoginBack.model.UserData;
import com.suchorit.NeurofleetLoginBack.service.JwtService;
import com.suchorit.NeurofleetLoginBack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String,String>> signup(@RequestBody UserData user){
        return userService.signup(user);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> logIn(@RequestBody UserData user){
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
    public ResponseEntity<UserData> getProfile(@RequestHeader("Authorization") String authHeader){
        return userService.getprofile(authHeader);
    }
}
