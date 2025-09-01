package com.example.backend.mapper;

import com.example.backend.dto.ExpenseResponseDto;
import com.example.backend.model.Expense;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ExpenseMapper {

    public ExpenseResponseDto toDto(Expense expense) {
        if (expense == null) {
            return null;
        }

        ExpenseResponseDto dto = new ExpenseResponseDto();
        dto.setExpense_id(expense.getExpense_id());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setDescription(expense.getDescription());
        dto.setDate(expense.getDate());
        dto.setExpenseType(expense.getExpenseType());
        
        // Chỉ lấy username thay vì toàn bộ User object
        if (expense.getUser() != null) {
            dto.setUsername(expense.getUser().getUsername());
        }

        return dto;
    }

    public List<ExpenseResponseDto> toDtoList(List<Expense> expenses) {
        if (expenses == null) {
            return null;
        }

        return expenses.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
