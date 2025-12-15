package com.suchorit.NeurofleetLoginBack.service;


import com.suchorit.NeurofleetLoginBack.model.AdminData;
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

    public ResponseEntity<Map<String,String>> signup(AdminData adminData) {
        Map<String, String> response=new HashMap<>();
        try {
            adminData.setPassword(encoder.encode(adminData.getPassword()));
            if(!userRepo.existsById(adminData.getEmail())){
                userRepo.save(adminData);
                response.put("Message","Account created Successfully");
            }
            else response.put("Message","Account Already exist");
        }catch (Exception e){
            response.put("Message",e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, String>> login(AdminData user) {
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

    public ResponseEntity<AdminData> getprofile(String authHeader) {
        try{
            String token=authHeader.substring(7);
            String email= jwtService.extractUserName(token);
            AdminData userData=userRepo.findByemail(email);
            userData.setPassword("**********");
            return ResponseEntity.ok(userData);
        }catch (Exception e){
            return new ResponseEntity<>(new AdminData(),HttpStatus.NO_CONTENT);
        }
    }
}
