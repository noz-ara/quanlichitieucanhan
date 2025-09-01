package com.example.backend.controller;

import com.example.backend.dto.ExpenseResponseDto;
import com.example.backend.dto.IncomeCreateDTO;
import com.example.backend.dto.IncomeUpdateDTO;
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
@RequestMapping("/api/income")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IncomeController {

    private final ExpenseService expenseService;
    private final UserRepository userRepository;
    private final ExpenseMapper expenseMapper;

    /**
     * Lấy tất cả income của user hiện tại
     */
    @GetMapping("/my")
    public ResponseEntity<List<ExpenseResponseDto>> getMyIncome() {
        List<Expense> incomes = expenseService.getExpensesByUserAndType(getCurrentUser(), ExpenseType.INCOME.name());
        return ResponseEntity.ok(expenseMapper.toDtoList(incomes));
    }

    /**
     * Lọc income theo category
     */
    @GetMapping("/my/category/{category}")
    public ResponseEntity<List<ExpenseResponseDto>> getMyIncomeByCategory(@PathVariable String category) {
        List<Expense> incomes = expenseService.getExpensesByUserAndCategory(getCurrentUser(), category)
                .stream()
                .filter(expense -> ExpenseType.INCOME.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(expenseMapper.toDtoList(incomes));
    }

    /**
     * Lọc income theo khoảng thời gian
     */
    @GetMapping("/my/date-range")
    public ResponseEntity<List<ExpenseResponseDto>> getMyIncomeByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<Expense> incomes = expenseService.getExpensesByUserAndDateRange(getCurrentUser(), startDate, endDate)
                .stream()
                .filter(expense -> ExpenseType.INCOME.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(expenseMapper.toDtoList(incomes));
    }

    /**
     * Lấy income theo id (của user hiện tại)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getIncomeById(@PathVariable Long id) {
        Expense income = expenseService.getExpenseByIdAndUser(id, getCurrentUser());
        if (income != null && ExpenseType.INCOME.name().equals(income.getExpenseType())) {
            return ResponseEntity.ok(expenseMapper.toDto(income));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Income not found"));
        }
    }

    /**
     * Tạo income mới
     */
    @PostMapping
    public ResponseEntity<?> createIncome(@Valid @RequestBody IncomeCreateDTO incomeDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) return handleValidationErrors(bindingResult);

        // Chuyển đổi DTO thành Expense entity
        Expense income = new Expense();
        income.setAmount(incomeDTO.getAmount());
        income.setCategory(incomeDTO.getCategory());
        income.setDescription(incomeDTO.getDescription());
        income.setDate(incomeDTO.getDate() != null ? incomeDTO.getDate() : LocalDate.now());
        income.setExpenseType(ExpenseType.INCOME.name());

        Expense created = expenseService.createExpense(income, getCurrentUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseMapper.toDto(created));
    }

    /**
     * Cập nhật income
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateIncome(
            @PathVariable Long id,
            @Valid @RequestBody IncomeUpdateDTO incomeDTO,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) return handleValidationErrors(bindingResult);

        // Kiểm tra xem expense có phải là income không
        Expense existingIncome = expenseService.getExpenseByIdAndUser(id, getCurrentUser());
        if (existingIncome == null || !ExpenseType.INCOME.name().equals(existingIncome.getExpenseType())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Income not found"));
        }

        // Cập nhật thông tin từ DTO
        existingIncome.setAmount(incomeDTO.getAmount());
        existingIncome.setCategory(incomeDTO.getCategory());
        existingIncome.setDescription(incomeDTO.getDescription());
        if (incomeDTO.getDate() != null) {
            existingIncome.setDate(incomeDTO.getDate());
        }

        Expense updated = expenseService.updateExpense(id, existingIncome, getCurrentUser());
        if (updated != null) {
            return ResponseEntity.ok(expenseMapper.toDto(updated));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Income not found or not yours"));
        }
    }

    /**
     * Xóa income
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable Long id) {
        // Kiểm tra xem expense có phải là income không
        Expense existingIncome = expenseService.getExpenseByIdAndUser(id, getCurrentUser());
        if (existingIncome == null || !ExpenseType.INCOME.name().equals(existingIncome.getExpenseType())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Income not found"));
        }

        boolean deleted = expenseService.deleteExpense(id, getCurrentUser());
        return deleted ? ResponseEntity.noContent().build()
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Income not found or not yours"));
    }

    /**
     * Đếm số income
     */
    @GetMapping("/my/count")
    public ResponseEntity<Map<String, Object>> getMyIncomeCount() {
        List<Expense> incomes = expenseService.getExpensesByUserAndType(getCurrentUser(), ExpenseType.INCOME.name());
        long count = incomes.size();
        return ResponseEntity.ok(Map.of(
                "count", count,
                "userId", getCurrentUser().getId(),
                "type", "INCOME"
        ));
    }

    /**
     * Lấy tổng income theo tháng
     */
    @GetMapping("/my/monthly/{year}/{month}")
    public ResponseEntity<Map<String, Object>> getMyMonthlyIncome(
            @PathVariable int year,
            @PathVariable int month) {
        
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        List<Expense> monthlyIncomes = expenseService.getExpensesByUserAndDateRange(getCurrentUser(), startDate, endDate)
                .stream()
                .filter(expense -> ExpenseType.INCOME.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        
        double totalAmount = monthlyIncomes.stream()
                .mapToDouble(expense -> expense.getAmount().doubleValue())
                .sum();
        
        return ResponseEntity.ok(Map.of(
                "year", year,
                "month", month,
                "totalIncome", totalAmount,
                "incomeCount", monthlyIncomes.size(),
                "incomes", expenseMapper.toDtoList(monthlyIncomes)
        ));
    }

    /**
     * Lấy tổng income theo năm
     */
    @GetMapping("/my/yearly/{year}")
    public ResponseEntity<Map<String, Object>> getMyYearlyIncome(@PathVariable int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);
        
        List<Expense> yearlyIncomes = expenseService.getExpensesByUserAndDateRange(getCurrentUser(), startDate, endDate)
                .stream()
                .filter(expense -> ExpenseType.INCOME.name().equals(expense.getExpenseType()))
                .collect(Collectors.toList());
        
        double totalAmount = yearlyIncomes.stream()
                .mapToDouble(expense -> expense.getAmount().doubleValue())
                .sum();
        
        return ResponseEntity.ok(Map.of(
                "year", year,
                "totalIncome", totalAmount,
                "incomeCount", yearlyIncomes.size(),
                "incomes", expenseMapper.toDtoList(yearlyIncomes)
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
