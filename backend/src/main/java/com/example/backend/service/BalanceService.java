package com.example.backend.service;

import com.example.backend.model.Expense;
import com.example.backend.model.ExpenseType;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class BalanceService {

    private final UserRepository userRepository;

    @Autowired
    public BalanceService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Cập nhật balance khi thêm expense mới
     */
    @Transactional
    public void updateBalanceOnExpenseCreate(Expense expense) {
        User user = expense.getUser();
        BigDecimal amount = expense.getAmount();
        ExpenseType expenseType = ExpenseType.fromString(expense.getExpenseType());

        if (expenseType != null) {
            updateUserBalance(user, amount, expenseType, true);
        }
    }

    /**
     * Cập nhật balance khi sửa expense
     */
    @Transactional
    public void updateBalanceOnExpenseUpdate(Expense oldExpense, Expense newExpense) {
        User user = newExpense.getUser();
        
        // Trừ balance cũ
        BigDecimal oldAmount = oldExpense.getAmount();
        ExpenseType oldExpenseType = ExpenseType.fromString(oldExpense.getExpenseType());
        if (oldExpenseType != null) {
            updateUserBalance(user, oldAmount, oldExpenseType, false);
        }
        
        // Cộng balance mới
        BigDecimal newAmount = newExpense.getAmount();
        ExpenseType newExpenseType = ExpenseType.fromString(newExpense.getExpenseType());
        if (newExpenseType != null) {
            updateUserBalance(user, newAmount, newExpenseType, true);
        }
    }

    /**
     * Cập nhật balance khi xóa expense
     */
    @Transactional
    public void updateBalanceOnExpenseDelete(Expense expense) {
        User user = expense.getUser();
        BigDecimal amount = expense.getAmount();
        ExpenseType expenseType = ExpenseType.fromString(expense.getExpenseType());

        if (expenseType != null) {
            updateUserBalance(user, amount, expenseType, false);
        }
    }

    /**
     * Cập nhật balance của user dựa trên loại expense
     */
    private void updateUserBalance(User user, BigDecimal amount, ExpenseType expenseType, boolean isAdd) {
        if (!expenseType.affectsBalance()) {
            return; // CASH không ảnh hưởng đến balance
        }

        BigDecimal currentBalance = user.getBalance();
        BigDecimal newBalance = currentBalance;

        if (isAdd) {
            if (expenseType.isPositive()) {
                newBalance = currentBalance.add(amount);
            } else {
                newBalance = currentBalance.subtract(amount);
            }
        } else {
            if (expenseType.isPositive()) {
                newBalance = currentBalance.subtract(amount);
            } else {
                newBalance = currentBalance.add(amount);
            }
        }

        user.setBalance(newBalance);
        userRepository.save(user);
    }

    /**
     * Tính toán balance hiện tại dựa trên tất cả expenses
     */
    @Transactional(readOnly = true)
    public BigDecimal calculateCurrentBalance(User user) {
        BigDecimal balance = BigDecimal.ZERO;
        
        for (Expense expense : user.getExpenses()) {
            ExpenseType expenseType = ExpenseType.fromString(expense.getExpenseType());
            if (expenseType != null && expenseType.affectsBalance()) {
                BigDecimal amount = expense.getAmount();
                
                if (expenseType.isPositive()) {
                    balance = balance.add(amount);
                } else {
                    balance = balance.subtract(amount);
                }
            }
        }
        
        return balance;
    }

    /**
     * Đồng bộ balance với tổng expenses (dùng để sửa lỗi nếu có)
     */
    @Transactional
    public void syncBalanceWithExpenses(User user) {
        BigDecimal calculatedBalance = calculateCurrentBalance(user);
        user.setBalance(calculatedBalance);
        userRepository.save(user);
    }

    /**
     * Lấy balance hiện tại của user
     */
    @Transactional(readOnly = true)
    public BigDecimal getCurrentBalance(User user) {
        return user.getBalance();
    }

    /**
     * Kiểm tra xem balance có đủ để thực hiện expense không
     */
    @Transactional(readOnly = true)
    public boolean hasSufficientBalance(User user, BigDecimal amount) {
        return user.getBalance().compareTo(amount) >= 0;
    }
}
