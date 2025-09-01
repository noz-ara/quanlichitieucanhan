package com.example.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String profileImageFileName;
    private BigDecimal balance;
    private List<ExpenseResponseDto> expenses;
}
