# API Test Script for ExpenseWise

## 🚀 **Bước 1: Start Backend**
```bash
cd backend
./mvnw spring-boot:run
```

## 🧪 **Bước 2: Test Authentication**

### Test Login (POST /auth/login)
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }' \
  -c cookies.txt \
  -v
```

**Expected Response:** 200 OK với session cookie

## 🧪 **Bước 3: Test New Endpoints**

### 1. Test GET /expenses/my (User's expenses)
```bash
curl -X GET http://localhost:8080/expenses/my \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -v
```

**Expected Response:** 200 OK với danh sách expenses của user

### 2. Test GET /expenses/my/category/{category}
```bash
curl -X GET http://localhost:8080/expenses/my/category/food \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -v
```

**Expected Response:** 200 OK với expenses theo category

### 3. Test GET /expenses/my/type/{expenseType}
```bash
curl -X GET http://localhost:8080/expenses/my/type/income \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -v
```

**Expected Response:** 200 OK với expenses theo type

### 4. Test GET /expenses/my/date-range
```bash
curl -X GET "http://localhost:8080/expenses/my/date-range?startDate=2024-01-01&endDate=2024-12-31" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -v
```

**Expected Response:** 200 OK với expenses theo date range

### 5. Test GET /expenses/my/count
```bash
curl -X GET http://localhost:8080/expenses/my/count \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -v
```

**Expected Response:** 200 OK với số lượng expenses

## 🧪 **Bước 4: Test CRUD Operations**

### Test POST /expenses (Create new expense)
```bash
curl -X POST http://localhost:8080/expenses \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "category": "food",
    "description": "Lunch",
    "expenseType": "expense",
    "date": "2024-01-15"
  }' \
  -v
```

**Expected Response:** 201 Created với expense mới

### Test PUT /expenses/{id} (Update expense)
```bash
curl -X PUT http://localhost:8080/expenses/1 \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 60.00,
    "category": "food",
    "description": "Updated lunch",
    "expenseType": "expense",
    "date": "2024-01-15"
  }' \
  -v
```

**Expected Response:** 200 OK với expense đã update

### Test DELETE /expenses/{id} (Delete expense)
```bash
curl -X DELETE http://localhost:8080/expenses/1 \
  -b cookies.txt \
  -v
```

**Expected Response:** 204 No Content

## 🧪 **Bước 5: Test Security**

### Test without authentication (should fail)
```bash
curl -X GET http://localhost:8080/expenses/my \
  -H "Content-Type: application/json" \
  -v
```

**Expected Response:** 401 Unauthorized

### Test with invalid session (should fail)
```bash
curl -X GET http://localhost:8080/expenses/my \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=invalid_session" \
  -v
```

**Expected Response:** 401 Unauthorized

## 🧪 **Bước 6: Test CORS**

### Test preflight request
```bash
curl -X OPTIONS http://localhost:8080/expenses/my \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Response:** 200 OK với CORS headers

## 📋 **Test Cases Checklist**

### Authentication Tests:
- [ ] Login thành công
- [ ] Session được tạo
- [ ] Cookie được set

### Endpoint Tests:
- [ ] GET /expenses/my - Trả về user expenses
- [ ] GET /expenses/my/category/{category} - Filter theo category
- [ ] GET /expenses/my/type/{expenseType} - Filter theo type
- [ ] GET /expenses/my/date-range - Filter theo date
- [ ] GET /expenses/my/count - Đếm expenses

### CRUD Tests:
- [ ] POST /expenses - Tạo expense mới
- [ ] PUT /expenses/{id} - Update expense
- [ ] DELETE /expenses/{id} - Delete expense

### Security Tests:
- [ ] Không đăng nhập → 401
- [ ] Session invalid → 401
- [ ] User chỉ thấy data của mình

### CORS Tests:
- [ ] Preflight request thành công
- [ ] CORS headers được set đúng

## 🚨 **Troubleshooting**

### Lỗi 403 Forbidden:
1. Kiểm tra CORS configuration
2. Kiểm tra Spring Security configuration
3. Kiểm tra authentication

### Lỗi 401 Unauthorized:
1. Kiểm tra login endpoint
2. Kiểm tra session management
3. Kiểm tra cookie handling

### Lỗi CORS:
1. Kiểm tra CORS configuration
2. Kiểm tra preflight requests
3. Kiểm tra allowed origins

## 📝 **Notes**

- Đảm bảo backend đang chạy trên port 8080
- Đảm bảo database đã được migration
- Đảm bảo user đã được tạo trong database
- Test từng endpoint một để isolate issues
