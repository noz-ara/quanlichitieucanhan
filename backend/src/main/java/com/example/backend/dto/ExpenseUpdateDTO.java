package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseUpdateDTO {
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    @NotNull(message = "Category is required")
    @Size(max = 50, message = "Category must be up to 50 characters")
    private String category;
    
    @Size(max = 255, message = "Description must be up to 255 characters")
    private String description;
    
    private LocalDate date;

    @Size(max = 20, message = "Budget group must be up to 20 characters")
    private String budgetGroup; // ESSENTIAL | WANTS | SAVINGS
}
