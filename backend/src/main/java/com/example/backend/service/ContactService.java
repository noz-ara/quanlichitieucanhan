package com.example.backend.service;

import com.example.backend.model.Contact;
import com.example.backend.model.User;
import com.example.backend.repository.ContactRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    @Transactional
    public Contact create(@Valid Contact contact, User owner) {
        contact.setOwner(owner);
        return contactRepository.save(contact);
    }

    @Transactional(readOnly = true)
    public List<Contact> getMyContacts(User owner) {
        return contactRepository.findByOwnerOrderByIdDesc(owner);
    }

    @Transactional
    public void deleteMyContact(Long id, User owner) {
        Contact contact = contactRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new IllegalArgumentException("Contact not found"));
        contactRepository.delete(contact);
    }
}


