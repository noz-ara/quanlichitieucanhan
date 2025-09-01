package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.BalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/balance")
@CrossOrigin(origins = "*")
public class BalanceController {

    private final BalanceService balanceService;
    private final UserRepository userRepository;

    @Autowired
    public BalanceController(BalanceService balanceService, UserRepository userRepository) {
        this.balanceService = balanceService;
        this.userRepository = userRepository;
    }

    /**
     * Lấy balance hiện tại của user đang đăng nhập
     */
    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentBalance() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("User not found"));
            }

            BigDecimal balance = balanceService.getCurrentBalance(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("balance", balance);
            response.put("message", "Balance retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("Error retrieving balance: " + e.getMessage()));
        }
    }

    /**
     * Đồng bộ balance với tổng expenses (dùng để sửa lỗi nếu có)
     */
    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> syncBalance() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("User not found"));
            }

            // Đồng bộ balance
            balanceService.syncBalanceWithExpenses(user);
            
            // Lấy balance mới sau khi đồng bộ
            BigDecimal newBalance = balanceService.getCurrentBalance(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("balance", newBalance);
            response.put("message", "Balance synchronized successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("Error synchronizing balance: " + e.getMessage()));
        }
    }

    /**
     * Kiểm tra xem balance có đủ để thực hiện expense không
     */
    @PostMapping("/check-sufficient")
    public ResponseEntity<Map<String, Object>> checkSufficientBalance(@RequestBody Map<String, Object> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("User not found"));
            }

            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            boolean hasSufficient = balanceService.hasSufficientBalance(user, amount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("hasSufficientBalance", hasSufficient);
            response.put("currentBalance", balanceService.getCurrentBalance(user));
            response.put("requiredAmount", amount);
            response.put("message", hasSufficient ? "Sufficient balance" : "Insufficient balance");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("Error checking balance: " + e.getMessage()));
        }
    }

    /**
     * Lấy thông tin chi tiết về balance và expenses
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getBalanceSummary() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("User not found"));
            }

            BigDecimal currentBalance = balanceService.getCurrentBalance(user);
            BigDecimal calculatedBalance = balanceService.calculateCurrentBalance(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("currentBalance", currentBalance);
            response.put("calculatedBalance", calculatedBalance);
            response.put("isBalanced", currentBalance.compareTo(calculatedBalance) == 0);
            response.put("message", "Balance summary retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse("Error retrieving balance summary: " + e.getMessage()));
        }
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}
