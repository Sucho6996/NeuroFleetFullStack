package com.suchorit.NeurofleetLoginBack.repo;


import com.suchorit.NeurofleetLoginBack.model.DriverData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<DriverData,String> {
    DriverData findByemail(String username);

    boolean existsByLicenseNumber(String licenseNumber);

    DriverData findByLicenseNumber(String license);
}
