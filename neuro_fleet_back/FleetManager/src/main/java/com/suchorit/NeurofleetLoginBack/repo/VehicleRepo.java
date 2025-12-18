package com.suchorit.NeurofleetLoginBack.repo;


import com.suchorit.NeurofleetLoginBack.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepo extends JpaRepository<Vehicle,String> {
    List<Vehicle> findAllByEmail(String email);

    Vehicle findByRegNo(String regNo);
}
