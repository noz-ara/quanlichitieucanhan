package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ==================== USER MANAGEMENT ====================

    /**
     * Lấy danh sách tất cả users (không bao gồm password)
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> userList = users.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("username", user.getUsername());
                    userMap.put("email", user.getEmail() != null ? user.getEmail() : "");
                    userMap.put("role", user.getRole() != null ? user.getRole() : "USER");
                    return userMap;
                })
                .toList();
        
        return ResponseEntity.ok(userList);
    }

    /**
     * Lấy thông tin user theo ID
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> userInfo = Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail() != null ? user.getEmail() : "",
                    "role", user.getRole() != null ? user.getRole() : "USER"
            );
            return ResponseEntity.ok(userInfo);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }
    }

    /**
     * Tạo user mới
     */
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> userData) {
        try {
            String username = userData.get("username");
            String password = userData.get("password");
            String email = userData.get("email");
            String role = userData.getOrDefault("role", "USER");

            // Kiểm tra username đã tồn tại
            if (userRepository.findByUsername(username).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Username already exists"));
            }

                    // Kiểm tra email đã tồn tại (nếu có)
        if (email != null && !email.isEmpty()) {
            // TODO: Implement findByEmail method in UserRepository if needed
            // For now, skip email validation
        }

            // Tạo user mới
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPassword(passwordEncoder.encode(password));
            newUser.setEmail(email);
            newUser.setRole(role);
            // User mặc định được enable

            User savedUser = userRepository.save(newUser);

            Map<String, Object> response = Map.of(
                    "message", "User created successfully",
                    "userId", savedUser.getId(),
                    "username", savedUser.getUsername()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Error creating user: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating user: " + e.getMessage()));
        }
    }

    /**
     * Cập nhật thông tin user
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long userId,
            @RequestBody Map<String, String> userData) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        boolean hasChanges = false;

        // Cập nhật email
        if (userData.containsKey("email")) {
            String newEmail = userData.get("email");
            if (newEmail != null && !newEmail.equals(user.getEmail())) {
                        // TODO: Implement email validation if needed
                user.setEmail(newEmail);
                hasChanges = true;
            }
        }

        // Cập nhật role
        if (userData.containsKey("role")) {
            String newRole = userData.get("role");
            if (newRole != null && !newRole.equals(user.getRole())) {
                user.setRole(newRole);
                hasChanges = true;
            }
        }

        // TODO: Implement enabled field if needed
        // For now, skip enabled status updates

        // Cập nhật password (nếu có)
        if (userData.containsKey("password")) {
            String newPassword = userData.get("password");
            if (newPassword != null && !newPassword.isEmpty()) {
                user.setPassword(passwordEncoder.encode(newPassword));
                hasChanges = true;
            }
        }

        if (hasChanges) {
            userRepository.save(user);
            return ResponseEntity.ok(Map.of(
                    "message", "User updated successfully",
                    "userId", user.getId()
            ));
        } else {
            return ResponseEntity.ok(Map.of("message", "No changes made"));
        }
    }

    /**
     * Xóa user
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        
        // Không cho phép xóa admin
        if ("ADMIN".equals(user.getRole())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Cannot delete admin user"));
        }

        // Không cho phép xóa chính mình
        // TODO: Lấy current user từ SecurityContext để so sánh
        
        userRepository.deleteById(userId);
        return ResponseEntity.ok(Map.of(
                "message", "User deleted successfully",
                "deletedUserId", userId
        ));
    }

    /**
     * Khóa/Mở khóa user
     */
    @PatchMapping("/users/{userId}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        
        // TODO: Implement enabled field if needed
        return ResponseEntity.ok(Map.of(
                "message", "User status toggle not implemented yet",
                "userId", user.getId()
        ));
    }

    /**
     * Reset password user
     */
    @PatchMapping("/users/{userId}/reset-password")
    public ResponseEntity<?> resetUserPassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> passwordData) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        String newPassword = passwordData.get("newPassword");
        if (newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "New password is required"));
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Password reset successfully",
                "userId", user.getId()
        ));
    }

    // ==================== STATISTICS ====================

    /**
     * Thống kê tổng quan về users
     */
    @GetMapping("/stats/users")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        List<User> allUsers = userRepository.findAll();
        
        long totalUsers = allUsers.size();
        long adminUsers = allUsers.stream().filter(u -> "ADMIN".equals(u.getRole())).count();
        long regularUsers = totalUsers - adminUsers;

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "adminUsers", adminUsers,
                "regularUsers", regularUsers
        ));
    }

    /**
     * Tìm kiếm users
     */
    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String role) {
        
        List<User> users = userRepository.findAll();
        
        // Lọc theo username
        if (username != null && !username.isEmpty()) {
            users = users.stream()
                    .filter(user -> user.getUsername().toLowerCase().contains(username.toLowerCase()))
                    .toList();
        }
        
        // Lọc theo email
        if (email != null && !email.isEmpty()) {
            users = users.stream()
                    .filter(user -> user.getEmail() != null && 
                            user.getEmail().toLowerCase().contains(email.toLowerCase()))
                    .toList();
        }
        
        // Lọc theo role
        if (role != null && !role.isEmpty()) {
            users = users.stream()
                    .filter(user -> role.equals(user.getRole()))
                    .toList();
        }
        
        List<Map<String, Object>> userList = users.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("username", user.getUsername());
                    userMap.put("email", user.getEmail() != null ? user.getEmail() : "");
                    userMap.put("role", user.getRole() != null ? user.getRole() : "USER");
                    return userMap;
                })
                .toList();
        
        return ResponseEntity.ok(Map.of(
                "searchResults", userList,
                "totalFound", userList.size()
        ));
    }
}
