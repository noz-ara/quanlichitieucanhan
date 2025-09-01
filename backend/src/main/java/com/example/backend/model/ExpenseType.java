package com.example.backend.model;

/**
 * Enum định nghĩa các loại expense và cách chúng ảnh hưởng đến balance
 */
public enum ExpenseType {
    
    /**
     * Thu nhập - Cộng vào balance
     */
    INCOME("Thu nhập", true, true),
    
    /**
     * Chi tiêu - Trừ khỏi balance
     */
    EXPENSE("Chi tiêu", true, false),
    
    /**
     * Tiền mặt - Không ảnh hưởng đến balance
     */
    CASH("Tiền mặt", false, false);
    
    private final String displayName;
    private final boolean affectsBalance;
    private final boolean isPositive; // true = cộng vào balance, false = trừ khỏi balance
    
    ExpenseType(String displayName, boolean affectsBalance, boolean isPositive) {
        this.displayName = displayName;
        this.affectsBalance = affectsBalance;
        this.isPositive = isPositive;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean affectsBalance() {
        return affectsBalance;
    }
    
    public boolean isPositive() {
        return isPositive;
    }
    
    /**
     * Kiểm tra xem expense type có hợp lệ không
     */
    public static boolean isValid(String type) {
        try {
            ExpenseType.valueOf(type.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * Lấy ExpenseType từ string, trả về null nếu không hợp lệ
     */
    public static ExpenseType fromString(String type) {
        try {
            return ExpenseType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
