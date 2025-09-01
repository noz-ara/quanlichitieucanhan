package com.example.backend.repository;

import com.example.backend.model.Contact;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByOwnerOrderByIdDesc(User owner);
    Optional<Contact> findByIdAndOwner(Long id, User owner);
}


