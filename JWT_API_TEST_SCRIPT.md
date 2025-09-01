# 🚀 JWT API Test Script cho ExpenseWise Backend

## 📋 **Prerequisites**
- Backend đang chạy trên `http://localhost:8080`
- MySQL database đang hoạt động
- User đã được tạo trong database

## 🔐 **1. Đăng ký User mới (nếu cần)**

```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: multipart/form-data" \
  -F "username=testuser" \
  -F "password=12345678" \
  -F "email=test@example.com"
```

**Response thành công:**
```json
{
  "message": "User registered successfully!"
}
```

## 🔑 **2. Đăng nhập và lấy JWT Token**

```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "12345678"
  }'
```

**Response thành công:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "username": "testuser",
  "role": "ROLE_USER",
  "message": "Login successful!"
}
```

**⚠️ Lưu ý:** Copy `token` value để sử dụng cho các API calls tiếp theo!

## 💰 **3. Test Expense APIs với JWT Token**

### **3.1. Tạo Expense mới**
```bash
curl -X POST http://localhost:8080/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "description": "Test Expense",
    "amount": 100.50,
    "category": "Food",
    "expenseType": "Expense",
    "date": "2024-01-15"
  }'
```

### **3.2. Lấy tất cả expenses của user hiện tại**
```bash
curl -X GET http://localhost:8080/expenses/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### **3.3. Lấy expense theo ID**
```bash
curl -X GET http://localhost:8080/expenses/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### **3.4. Lọc expenses theo category**
```bash
curl -X GET http://localhost:8080/expenses/my/category/Food \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### **3.5. Lọc expenses theo type**
```bash
curl -X GET http://localhost:8080/expenses/my/type/Expense \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### **3.6. Lọc expenses theo date range**
```bash
curl -X GET "http://localhost:8080/expenses/my/date-range?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### **3.7. Cập nhật expense**
```bash
curl -X PUT http://localhost:8080/expenses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "description": "Updated Test Expense",
    "amount": 150.75,
    "category": "Food",
    "expenseType": "Expense",
    "date": "2024-01-15"
  }'
```

### **3.8. Xóa expense**
```bash
curl -X DELETE http://localhost:8080/expenses/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🧪 **4. Test Error Cases**

### **4.1. Không có JWT Token (401 Unauthorized)**
```bash
curl -X GET http://localhost:8080/expenses/my
```

### **4.2. JWT Token không hợp lệ (401 Unauthorized)**
```bash
curl -X GET http://localhost:8080/expenses/my \
  -H "Authorization: Bearer invalid_token_here"
```

### **4.3. JWT Token hết hạn (401 Unauthorized)**
```bash
# Sử dụng token đã hết hạn
curl -X GET http://localhost:8080/expenses/my \
  -H "Authorization: Bearer EXPIRED_TOKEN_HERE"
```

## 🔍 **5. Test với Postman**

### **5.1. Setup Postman Collection**
1. Tạo collection mới: `ExpenseWise JWT API`
2. Tạo environment với variable: `jwt_token`

### **5.2. Login Request**
- **Method:** POST
- **URL:** `http://localhost:8080/login`
- **Body:** Raw JSON
```json
{
  "username": "testuser",
  "password": "12345678"
}
```

### **5.3. Test Script cho Login**
```javascript
// Postman Test Script
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("jwt_token", response.token);
    console.log("JWT Token saved:", response.token);
}
```

### **5.4. Expense Requests**
- **Headers:** `Authorization: Bearer {{jwt_token}}`
- **Body:** Raw JSON (cho POST/PUT)

## 🚨 **6. Troubleshooting**

### **6.1. Lỗi 401 Unauthorized**
- Kiểm tra JWT token có đúng format: `Bearer <token>`
- Kiểm tra token có hết hạn không
- Kiểm tra user có tồn tại trong database không

### **6.2. Lỗi 403 Forbidden**
- Kiểm tra user có quyền truy cập resource không
- Kiểm tra role của user

### **6.3. Lỗi 500 Internal Server Error**
- Kiểm tra backend logs
- Kiểm tra database connection
- Kiểm tra JWT secret key configuration

## 📝 **7. JWT Token Structure**

JWT token có 3 phần:
```
eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTcwNTQ5NjAwMCwiZXhwIjoxNzA1NTg0NDAwfQ.signature
```

- **Header:** Thuật toán mã hóa
- **Payload:** Thông tin user và thời gian hết hạn
- **Signature:** Chữ ký xác thực

## 🔒 **8. Security Features**

✅ **JWT Token-based Authentication**
✅ **Stateless Session Management**
✅ **User-specific Data Isolation**
✅ **Role-based Access Control**
✅ **Secure API Endpoints**
✅ **CORS Configuration**
✅ **Password Encryption (BCrypt)**

## 🎯 **9. Next Steps**

1. **Frontend Integration:** Cập nhật React app để sử dụng JWT
2. **Token Refresh:** Implement refresh token mechanism
3. **Logout:** Implement token blacklisting
4. **Rate Limiting:** Add API rate limiting
5. **Audit Logging:** Log all API access attempts

---

**🎉 Chúc mừng! Bạn đã thành công implement JWT authentication cho ExpenseWise backend!**
