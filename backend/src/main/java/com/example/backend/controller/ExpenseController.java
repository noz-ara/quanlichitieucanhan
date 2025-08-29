package com.example.backend.controller;

import com.example.backend.model.Expense;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExpenseById(@PathVariable Long id) {
        Expense expense = expenseService.getExpenseById(id);
        if (expense != null) {
            return ResponseEntity.ok(expense);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createExpense(
            @Valid @RequestBody Expense expense,
            BindingResult bindingResult
    ) {
        // Check for validation errors
        if (bindingResult.hasErrors()) {
            return handleValidationErrors(bindingResult);
        }

        log.info("Received expense: {}", expense);

        // Initialize date with current date if null
        if (expense.getDate() == null) {
            expense.setDate(LocalDate.now());
        }

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Check if authenticated
//        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
//            log.warn("User not authenticated. Authentication: {}", authentication);
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//        }else {
//            log.info("User Principal: {}", authentication.getPrincipal());
//        }

        // Retrieve principal object
//        User user;
//        if (authentication.getPrincipal() instanceof UserDetails) {
//            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//            log.info("User '{}' is authenticated. Authorities: {}", userDetails.getUsername(), userDetails.getAuthorities());
//            String username = userDetails.getUsername();
//
//            // Retrieve user from repository
//            user = userRepository.findByUsername(username)
//                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//        }

//        // Set the user in the expense
//        expense.setUser(user);
//        String username = principal.getName(); // Get logged-in username
//
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found: " + username));
//
//        expense.setUser(user); // Set user for the expense
        log.info("expense: {}", expense);

        try {
            Expense createdExpense = expenseService.createExpense(expense);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while creating expense: " + e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @Valid @RequestBody Expense expenseDetails, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return handleValidationErrors(bindingResult);
        }

        try {
            Expense updatedExpense = expenseService.updateExpense(id, expenseDetails);
            if (updatedExpense != null) {
                return ResponseEntity.ok(updatedExpense);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while updating expense: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        boolean deleted = expenseService.deleteExpense(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private ResponseEntity<?> handleValidationErrors(BindingResult bindingResult) {
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("message", "Validation failed");
        List<String> validationErrors = bindingResult.getAllErrors().stream()
                .map(ObjectError::getDefaultMessage)
                .collect(Collectors.toList());
        responseBody.put("errors", validationErrors);
        return ResponseEntity.badRequest().body(responseBody);
    }
}
