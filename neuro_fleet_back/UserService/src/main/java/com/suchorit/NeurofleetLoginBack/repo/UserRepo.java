package com.suchorit.NeurofleetLoginBack.repo;


import com.suchorit.NeurofleetLoginBack.model.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<UserData,String> {
    UserData findByemail(String username);
}
