package com.example.backend.repository;

import com.example.backend.model.Expense;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    // Find all expenses for a specific user
    List<Expense> findByUserOrderByDateDesc(User user);
    
    // Find expenses by user and date range
    List<Expense> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate);
    
    // Find expenses by user and category
    List<Expense> findByUserAndCategoryOrderByDateDesc(User user, String category);
    
    // Find expenses by user and expense type
    List<Expense> findByUserAndExpenseTypeOrderByDateDesc(User user, String expenseType);
    
    // Count total expenses for a user
    long countByUser(User user);
    
    // Check if expense belongs to user (for security)
    @Query("SELECT COUNT(e) > 0 FROM Expense e WHERE e.expense_id = :expenseId AND e.user = :user")
    boolean existsByExpenseIdAndUser(@Param("expenseId") Long expenseId, @Param("user") User user);
}
