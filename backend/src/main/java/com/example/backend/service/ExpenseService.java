package com.example.backend.service;

import com.example.backend.model.Expense;
import com.example.backend.repository.ExpenseRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import java.util.List;
import java.util.Optional;

@Service
@Validated
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Transactional
    public Expense createExpense(@Valid Expense expense) {
        return expenseRepository.save(expense);
    }

    @Transactional(readOnly = true)
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Expense getExpenseById(Long id) {
        Optional<Expense> expenseOptional = expenseRepository.findById(id);
        return expenseOptional.orElse(null);
    }

    @Transactional
    public Expense updateExpense(Long id, @Valid Expense expenseDetails) {
        if (expenseRepository.existsById(id)) {
            expenseDetails.setExpense_id(id);
            return expenseRepository.save(expenseDetails);
        }
        return null;
    }

    @Transactional
    public boolean deleteExpense(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
