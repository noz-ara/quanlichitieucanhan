package com.example.backend.controller;

import com.example.backend.dto.ExpenseCreateDTO;
import com.example.backend.dto.ExpenseResponseDto;
import com.example.backend.dto.ExpenseUpdateDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserRepository userRepository;
    private final ExpenseMapper expenseMapper;

    /**
     * Lấy toàn bộ expenses – chỉ ADMIN mới được xem
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ExpenseResponseDto>> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenseMapper.toDtoList(expenses));
    }

    /** Lấy tất cả expenses (chi tiêu) của user hiện tại */
    @GetMapping("/my")
    public ResponseEntity<List<ExpenseResponseDto>> getMyExpenses() {
        try {
            User currentUser = getCurrentUser();
            List<Expense> expenses = expenseService.getExpensesByUserAndType(currentUser, ExpenseType.EXPENSE.name());
            return ResponseEntity.ok(expenseMapper.toDtoList(expenses));
        } catch (Exception e) {
            log.error("Error getting my expenses: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /** Lọc theo category */
    @GetMapping("/my/category/{category}")
    public ResponseEntity<List<ExpenseResponseDto>> getMyExpensesByCategory(@PathVariable String category) {
        List<Expense> expenses = expenseService.getExpensesByUserAndCategory(getCurrentUser(), category)
                .stream()
                .filter(expense -> ExpenseType.EXPENSE.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(expenseMapper.toDtoList(expenses));
    }

    /** Lọc theo khoảng thời gian */
    @GetMapping("/my/date-range")
    public ResponseEntity<List<ExpenseResponseDto>> getMyExpensesByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<Expense> expenses = expenseService.getExpensesByUserAndDateRange(getCurrentUser(), startDate, endDate)
                .stream()
                .filter(expense -> ExpenseType.EXPENSE.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(expenseMapper.toDtoList(expenses));
    }

    /** Lấy expense theo id (của user hiện tại) */
    @GetMapping("/{id}")
    public ResponseEntity<?> getExpenseById(@PathVariable Long id) {
        Expense expense = expenseService.getExpenseByIdAndUser(id, getCurrentUser());
        if (expense != null && ExpenseType.EXPENSE.name().equals(expense.getExpenseType())) {
            return ResponseEntity.ok(expenseMapper.toDto(expense));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Expense not found"));
        }
    }

    /** Tạo expense mới (chi tiêu) */
    @PostMapping
    public ResponseEntity<?> createExpense(@Valid @RequestBody ExpenseCreateDTO expenseDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) return handleValidationErrors(bindingResult);

        // Chuyển đổi DTO thành Expense entity
        Expense expense = new Expense();
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(expenseDTO.getCategory());
        expense.setDescription(expenseDTO.getDescription());
        expense.setDate(expenseDTO.getDate() != null ? expenseDTO.getDate() : LocalDate.now());
        expense.setBudgetGroup(expenseDTO.getBudgetGroup());
        expense.setExpenseType(ExpenseType.EXPENSE.name());

        Expense created = expenseService.createExpense(expense, getCurrentUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseMapper.toDto(created));
    }

    /** Cập nhật expense */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseUpdateDTO expenseDTO,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) return handleValidationErrors(bindingResult);

        // Kiểm tra xem expense có phải là EXPENSE không
        Expense existingExpense = expenseService.getExpenseByIdAndUser(id, getCurrentUser());
        if (existingExpense == null || !ExpenseType.EXPENSE.name().equals(existingExpense.getExpenseType())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Expense not found"));
        }

        // Cập nhật thông tin từ DTO
        existingExpense.setAmount(expenseDTO.getAmount());
        existingExpense.setCategory(expenseDTO.getCategory());
        existingExpense.setDescription(expenseDTO.getDescription());
        if (expenseDTO.getDate() != null) {
            existingExpense.setDate(expenseDTO.getDate());
        }
        existingExpense.setBudgetGroup(expenseDTO.getBudgetGroup());

        Expense updated = expenseService.updateExpense(id, existingExpense, getCurrentUser());
        if (updated != null) {
            return ResponseEntity.ok(expenseMapper.toDto(updated));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Expense not found or not yours"));
        }
    }

    /** Xóa expense */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        // Kiểm tra xem expense có phải là EXPENSE không
        Expense existingExpense = expenseService.getExpenseByIdAndUser(id, getCurrentUser());
        if (existingExpense == null || !ExpenseType.EXPENSE.name().equals(existingExpense.getExpenseType())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Expense not found"));
        }

        boolean deleted = expenseService.deleteExpense(id, getCurrentUser());
        return deleted ? ResponseEntity.noContent().build()
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Expense not found or not yours"));
    }

    /** Đếm số expense */
    @GetMapping("/my/count")
    public ResponseEntity<Map<String, Object>> getMyExpenseCount() {
        List<Expense> expenses = expenseService.getExpensesByUserAndType(getCurrentUser(), ExpenseType.EXPENSE.name());
        long count = expenses.size();
        return ResponseEntity.ok(Map.of(
                "count", count,
                "userId", getCurrentUser().getId(),
                "type", "EXPENSE"
        ));
    }

    /** Lấy tổng expense theo tháng */
    @GetMapping("/my/monthly/{year}/{month}")
    public ResponseEntity<Map<String, Object>> getMyMonthlyExpenses(
            @PathVariable int year,
            @PathVariable int month) {
        
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        List<Expense> monthlyExpenses = expenseService.getExpensesByUserAndDateRange(getCurrentUser(), startDate, endDate)
                .stream()
                .filter(expense -> ExpenseType.EXPENSE.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        
        double totalAmount = monthlyExpenses.stream()
                .mapToDouble(expense -> expense.getAmount().doubleValue())
                .sum();
        
        return ResponseEntity.ok(Map.of(
                "year", year,
                "month", month,
                "totalExpense", totalAmount,
                "expenseCount", monthlyExpenses.size(),
                "expenses", expenseMapper.toDtoList(monthlyExpenses)
        ));
    }

    /** Lấy tổng expense theo năm */
    @GetMapping("/my/yearly/{year}")
    public ResponseEntity<Map<String, Object>> getMyYearlyExpenses(@PathVariable int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);
        
        List<Expense> yearlyExpenses = expenseService.getExpensesByUserAndDateRange(getCurrentUser(), startDate, endDate)
                .stream()
                .filter(expense -> ExpenseType.EXPENSE.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        
        double totalAmount = yearlyExpenses.stream()
                .mapToDouble(expense -> expense.getAmount().doubleValue())
                .sum();
        
        return ResponseEntity.ok(Map.of(
                "year", year,
                "totalExpense", totalAmount,
                "expenseCount", yearlyExpenses.size(),
                "expenses", expenseMapper.toDtoList(yearlyExpenses)
        ));
    }

    /** Lấy user hiện tại */
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UsernameNotFoundException("User not authenticated");
        }
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /** Xử lý lỗi validation */
    private ResponseEntity<?> handleValidationErrors(BindingResult bindingResult) {
        List<String> errors = bindingResult.getAllErrors().stream()
                .map(ObjectError::getDefaultMessage)
                .collect(Collectors.toList());
        return ResponseEntity.badRequest().body(Map.of("message", "Validation failed", "errors", errors));
    }
}
