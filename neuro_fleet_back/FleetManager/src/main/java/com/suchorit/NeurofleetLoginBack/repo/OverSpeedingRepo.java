package com.suchorit.NeurofleetLoginBack.repo;

import com.suchorit.NeurofleetLoginBack.model.OverSpeedingData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OverSpeedingRepo extends JpaRepository<OverSpeedingData,Integer> {
}
