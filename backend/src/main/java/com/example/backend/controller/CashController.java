package com.example.backend.controller;

import com.example.backend.dto.CashCreateDTO;
import com.example.backend.dto.CashUpdateDTO;
import com.example.backend.dto.ExpenseResponseDto;
import com.example.backend.mapper.ExpenseMapper;
import com.example.backend.model.Expense;
import com.example.backend.model.ExpenseType;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/cash")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CashController {

    private final ExpenseService expenseService;
    private final UserRepository userRepository;
    private final ExpenseMapper expenseMapper;

    /**
     * Lấy tất cả cash transactions của user hiện tại
     */
    @GetMapping("/my")
    public ResponseEntity<List<ExpenseResponseDto>> getMyCashTransactions() {
        List<Expense> cashTransactions = expenseService.getExpensesByUserAndType(getCurrentUser(), ExpenseType.CASH.name());
        return ResponseEntity.ok(expenseMapper.toDtoList(cashTransactions));
    }

    /**
     * Lọc cash transactions theo category
     */
    @GetMapping("/my/category/{category}")
    public ResponseEntity<List<ExpenseResponseDto>> getMyCashByCategory(@PathVariable String category) {
        List<Expense> cashTransactions = expenseService.getExpensesByUserAndCategory(getCurrentUser(), category)
                .stream()
                .filter(expense -> ExpenseType.CASH.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(expenseMapper.toDtoList(cashTransactions));
    }

    /**
     * Lọc cash transactions theo khoảng thời gian
     */
    @GetMapping("/my/date-range")
    public ResponseEntity<List<ExpenseResponseDto>> getMyCashByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<Expense> cashTransactions = expenseService.getExpensesByUserAndDateRange(getCurrentUser(), startDate, endDate)
                .stream()
                .filter(expense -> ExpenseType.CASH.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(expenseMapper.toDtoList(cashTransactions));
    }

    /**
     * Lấy cash transaction theo id (của user hiện tại)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCashById(@PathVariable Long id) {
        Expense cashTransaction = expenseService.getExpenseByIdAndUser(id, getCurrentUser());
        if (cashTransaction != null && ExpenseType.CASH.name().equals(cashTransaction.getExpenseType())) {
            return ResponseEntity.ok(expenseMapper.toDto(cashTransaction));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Cash transaction not found"));
        }
    }

    /**
     * Tạo cash transaction mới
     */
    @PostMapping
    public ResponseEntity<?> createCashTransaction(@Valid @RequestBody CashCreateDTO cashDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) return handleValidationErrors(bindingResult);

        // Chuyển đổi DTO thành Expense entity
        Expense cashTransaction = new Expense();
        cashTransaction.setAmount(cashDTO.getAmount());
        cashTransaction.setCategory(cashDTO.getCategory());
        cashTransaction.setDescription(cashDTO.getDescription());
        cashTransaction.setDate(cashDTO.getDate() != null ? cashDTO.getDate() : LocalDate.now());
        cashTransaction.setExpenseType(ExpenseType.CASH.name());

        Expense created = expenseService.createExpense(cashTransaction, getCurrentUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseMapper.toDto(created));
    }

    /**
     * Cập nhật cash transaction
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCashTransaction(
            @PathVariable Long id,
            @Valid @RequestBody CashUpdateDTO cashDTO,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) return handleValidationErrors(bindingResult);

        // Kiểm tra xem expense có phải là CASH không
        Expense existingCash = expenseService.getExpenseByIdAndUser(id, getCurrentUser());
        if (existingCash == null || !ExpenseType.CASH.name().equals(existingCash.getExpenseType())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Cash transaction not found"));
        }

        // Cập nhật thông tin từ DTO
        existingCash.setAmount(cashDTO.getAmount());
        existingCash.setCategory(cashDTO.getCategory());
        existingCash.setDescription(cashDTO.getDescription());
        if (cashDTO.getDate() != null) {
            existingCash.setDate(cashDTO.getDate());
        }

        Expense updated = expenseService.updateExpense(id, existingCash, getCurrentUser());
        if (updated != null) {
            return ResponseEntity.ok(expenseMapper.toDto(updated));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Cash transaction not found or not yours"));
        }
    }

    /**
     * Xóa cash transaction
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCashTransaction(@PathVariable Long id) {
        // Kiểm tra xem expense có phải là CASH không
        Expense existingCash = expenseService.getExpenseByIdAndUser(id, getCurrentUser());
        if (existingCash == null || !ExpenseType.CASH.name().equals(existingCash.getExpenseType())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Cash transaction not found"));
        }

        boolean deleted = expenseService.deleteExpense(id, getCurrentUser());
        return deleted ? ResponseEntity.noContent().build()
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Cash transaction not found or not yours"));
    }

    /**
     * Đếm số cash transactions
     */
    @GetMapping("/my/count")
    public ResponseEntity<Map<String, Object>> getMyCashCount() {
        List<Expense> cashTransactions = expenseService.getExpensesByUserAndType(getCurrentUser(), ExpenseType.CASH.name());
        long count = cashTransactions.size();
        return ResponseEntity.ok(Map.of(
                "count", count,
                "userId", getCurrentUser().getId(),
                "type", "CASH"
        ));
    }

    /**
     * Lấy tổng cash theo tháng
     */
    @GetMapping("/my/monthly/{year}/{month}")
    public ResponseEntity<Map<String, Object>> getMyMonthlyCash(
            @PathVariable int year,
            @PathVariable int month) {
        
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        List<Expense> monthlyCash = expenseService.getExpensesByUserAndDateRange(getCurrentUser(), startDate, endDate)
                .stream()
                .filter(expense -> ExpenseType.CASH.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        
        double totalAmount = monthlyCash.stream()
                .mapToDouble(expense -> expense.getAmount().doubleValue())
                .sum();
        
        return ResponseEntity.ok(Map.of(
                "year", year,
                "month", month,
                "totalCash", totalAmount,
                "cashCount", monthlyCash.size(),
                "cashTransactions", expenseMapper.toDtoList(monthlyCash)
        ));
    }

    /**
     * Lấy tổng cash theo năm
     */
    @GetMapping("/my/yearly/{year}")
    public ResponseEntity<Map<String, Object>> getMyYearlyCash(@PathVariable int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);
        
        List<Expense> yearlyCash = expenseService.getExpensesByUserAndDateRange(getCurrentUser(), startDate, endDate)
                .stream()
                .filter(expense -> ExpenseType.CASH.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        
        double totalAmount = yearlyCash.stream()
                .mapToDouble(expense -> expense.getAmount().doubleValue())
                .sum();
        
        return ResponseEntity.ok(Map.of(
                "year", year,
                "totalCash", totalAmount,
                "cashCount", yearlyCash.size(),
                "cashTransactions", expenseMapper.toDtoList(yearlyCash)
        ));
    }

    /**
     * Lấy user hiện tại
     */
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UsernameNotFoundException("User not authenticated");
        }
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /**
     * Xử lý lỗi validation
     */
    private ResponseEntity<?> handleValidationErrors(BindingResult bindingResult) {
        List<String> errors = bindingResult.getAllErrors().stream()
                .map(ObjectError::getDefaultMessage)
                .collect(Collectors.toList());
        return ResponseEntity.badRequest().body(Map.of("message", "Validation failed", "errors", errors));
    }
}
