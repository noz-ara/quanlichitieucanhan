package com.example.backend.repository;

import com.example.backend.model.Bill;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByOwnerOrderByIdDesc(User owner);
}


