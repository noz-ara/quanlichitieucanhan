package com.example.backend.service;

import com.example.backend.model.Expense;
import com.example.backend.model.User;
import com.example.backend.repository.ExpenseRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Validated
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final BalanceService balanceService;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository, BalanceService balanceService) {
        this.expenseRepository = expenseRepository;
        this.balanceService = balanceService;
    }

    @Transactional
    public Expense createExpense(@Valid Expense expense, User user) {
        expense.setUser(user);
        Expense savedExpense = expenseRepository.save(expense);
        
        // Tự động cập nhật balance
        balanceService.updateBalanceOnExpenseCreate(savedExpense);
        
        return savedExpense;
    }

    @Transactional(readOnly = true)
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Expense> getExpensesByUser(User user) {
        return expenseRepository.findByUserOrderByDateDesc(user);
    }

    @Transactional(readOnly = true)
    public List<Expense> getExpensesByUserAndDateRange(User user, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<Expense> getExpensesByUserAndCategory(User user, String category) {
        return expenseRepository.findByUserAndCategoryOrderByDateDesc(user, category);
    }

    @Transactional(readOnly = true)
    public List<Expense> getExpensesByUserAndType(User user, String expenseType) {
        return expenseRepository.findByUserAndExpenseTypeOrderByDateDesc(user, expenseType);
    }

    @Transactional(readOnly = true)
    public Expense getExpenseById(Long id) {
        Optional<Expense> expenseOptional = expenseRepository.findById(id);
        return expenseOptional.orElse(null);
    }

    @Transactional(readOnly = true)
    public Expense getExpenseByIdAndUser(Long id, User user) {
        if (expenseRepository.existsByExpenseIdAndUser(id, user)) {
            return expenseRepository.findById(id).orElse(null);
        }
        return null;
    }

    @Transactional
    public Expense updateExpense(Long id, @Valid Expense expenseDetails, User user) {
        if (expenseRepository.existsByExpenseIdAndUser(id, user)) {
            // Lấy expense cũ để so sánh balance
            Expense oldExpense = expenseRepository.findById(id).orElse(null);
            if (oldExpense != null) {
                expenseDetails.setExpense_id(id);
                expenseDetails.setUser(user);
                Expense updatedExpense = expenseRepository.save(expenseDetails);
                
                // Tự động cập nhật balance
                balanceService.updateBalanceOnExpenseUpdate(oldExpense, updatedExpense);
                
                return updatedExpense;
            }
        }
        return null;
    }

    @Transactional
    public boolean deleteExpense(Long id, User user) {
        if (expenseRepository.existsByExpenseIdAndUser(id, user)) {
            // Lấy expense trước khi xóa để cập nhật balance
            Expense expenseToDelete = expenseRepository.findById(id).orElse(null);
            if (expenseToDelete != null) {
                expenseRepository.deleteById(id);
                
                // Tự động cập nhật balance
                balanceService.updateBalanceOnExpenseDelete(expenseToDelete);
                
                return true;
            }
        }
        return false;
    }

    @Transactional(readOnly = true)
    public long getExpenseCountByUser(User user) {
        return expenseRepository.countByUser(user);
    }
}
