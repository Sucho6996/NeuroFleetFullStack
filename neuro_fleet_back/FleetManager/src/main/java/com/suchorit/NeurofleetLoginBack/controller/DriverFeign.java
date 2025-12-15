package com.suchorit.NeurofleetLoginBack.controller;


import com.suchorit.NeurofleetLoginBack.model.DriverData;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("DriverService")
public interface DriverFeign {
    @PostMapping("/driver/getProfile")
    public ResponseEntity<DriverData> getProf(@RequestParam("license") String license);
}
