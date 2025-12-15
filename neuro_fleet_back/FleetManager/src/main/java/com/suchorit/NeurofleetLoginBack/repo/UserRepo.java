package com.suchorit.NeurofleetLoginBack.repo;


import com.suchorit.NeurofleetLoginBack.model.FleetManagerData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<FleetManagerData,String> {
    FleetManagerData findByemail(String username);
}
