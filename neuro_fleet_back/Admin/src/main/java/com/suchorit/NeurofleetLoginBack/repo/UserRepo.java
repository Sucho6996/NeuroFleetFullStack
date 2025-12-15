package com.suchorit.NeurofleetLoginBack.repo;


import com.suchorit.NeurofleetLoginBack.model.AdminData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<AdminData,String> {
    AdminData findByemail(String username);
}
