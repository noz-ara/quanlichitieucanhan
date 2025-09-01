package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "bill_participants")
public class BillParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    // Tham chiếu tới user hoặc contact
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    // Với PERCENT: percent; Với CUSTOM: amount; Với EQUAL: bỏ trống
    private BigDecimal amount;   // số tiền participant chịu (nếu CUSTOM hoặc computed)
    private BigDecimal percent;  // phần trăm (0-100) nếu PERCENT
}


