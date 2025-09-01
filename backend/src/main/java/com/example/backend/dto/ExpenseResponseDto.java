package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseResponseDto {
    private Long expense_id;
    private BigDecimal amount;
    private String category;
    private String description;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    
    private String expenseType;
    private String username; // Chỉ lấy username thay vì toàn bộ User object
}
