package com.example.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BalanceDTO {
    private BigDecimal currentBalance;
    private BigDecimal calculatedBalance;
    private boolean isBalanced;
    private String message;
    private boolean success;
    
    public BalanceDTO() {}
    
    public BalanceDTO(BigDecimal currentBalance, BigDecimal calculatedBalance, boolean isBalanced, String message, boolean success) {
        this.currentBalance = currentBalance;
        this.calculatedBalance = calculatedBalance;
        this.isBalanced = isBalanced;
        this.message = message;
        this.success = success;
    }
    
    public static BalanceDTO success(BigDecimal currentBalance, BigDecimal calculatedBalance, String message) {
        return new BalanceDTO(currentBalance, calculatedBalance, currentBalance.compareTo(calculatedBalance) == 0, message, true);
    }
    
    public static BalanceDTO error(String message) {
        return new BalanceDTO(null, null, false, message, false);
    }
}
