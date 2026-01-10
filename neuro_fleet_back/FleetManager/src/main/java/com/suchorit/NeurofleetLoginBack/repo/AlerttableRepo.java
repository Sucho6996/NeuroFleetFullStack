package com.suchorit.NeurofleetLoginBack.repo;

import com.suchorit.NeurofleetLoginBack.model.AlertTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlerttableRepo extends JpaRepository<AlertTable,Long> {
    List<AlertTable> findAllByEmail(String email);
}
