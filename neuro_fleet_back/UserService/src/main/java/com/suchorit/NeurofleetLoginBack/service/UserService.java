package com.suchorit.NeurofleetLoginBack.service;


import com.suchorit.NeurofleetLoginBack.model.UserData;
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

import java.beans.Encoder;
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

    public ResponseEntity<Map<String,String>> signup(UserData userData) {
        Map<String, String> response=new HashMap<>();
        try {
            userData.setPassword(encoder.encode(userData.getPassword()));
            if(!userRepo.existsById(userData.getEmail())){
                userRepo.save(userData);
                response.put("Message","Account created Successfully");
                return ResponseEntity.ok(response);
            }
            else response.put("Message","Account Already exist");
        }catch (Exception e){
            response.put("Message",e.getMessage());
        }
        return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<Map<String, String>> login(UserData user) {
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

    public ResponseEntity<UserData> getprofile(String authHeader) {
        try{
            String token=authHeader.substring(7);
            String email= jwtService.extractUserName(token);
            UserData userData=userRepo.findByemail(email);
            userData.setPassword("**********");
            return ResponseEntity.ok(userData);
        }catch (Exception e){
            return new ResponseEntity<>(new UserData(),HttpStatus.NO_CONTENT);
        }
    }
}
