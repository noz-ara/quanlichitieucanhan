# 🔄 Test Circular Reference Fix

## 🎯 **Mục tiêu:**
Kiểm tra xem circular reference serialization đã được fix chưa

## 🧪 **Test Cases:**

### **1. Test Login để lấy JWT Token**
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "noz",
    "password": "12345678"
  }'
```

### **2. Test Get My Expenses (sẽ trả về DTOs)**
```bash
curl -X GET http://localhost:8080/expenses/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response (không có circular reference):**
```json
[
  {
    "expense_id": 1,
    "amount": 100.50,
    "category": "Food",
    "description": "Lunch",
    "date": "2024-01-15",
    "expenseType": "Expense",
    "username": "noz"
  }
]
```

### **3. Test Get Expense by ID**
```bash
curl -X GET http://localhost:8080/expenses/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "expense_id": 1,
  "amount": 100.50,
  "category": "Food",
  "description": "Lunch",
  "date": "2024-01-15",
  "expenseType": "Expense",
  "username": "noz"
}
```

## ✅ **Dấu hiệu thành công:**

1. **Không có lỗi 500 Internal Server Error**
2. **Response JSON clean, không có nested objects**
3. **Chỉ có username thay vì toàn bộ User object**
4. **Không có infinite recursion**

## 🚨 **Dấu hiệu vẫn còn vấn đề:**

1. **Lỗi 500 với message về LazyInitializationException**
2. **Response quá lớn hoặc timeout**
3. **Stack overflow error**
4. **Circular reference error trong logs**

## 🔧 **Nếu vẫn còn vấn đề:**

### **Kiểm tra logs:**
```bash
# Xem backend logs
docker-compose logs backend
```

### **Kiểm tra database:**
```sql
-- Kiểm tra expenses table
SELECT * FROM expenses LIMIT 5;

-- Kiểm tra users table  
SELECT * FROM users LIMIT 5;
```

### **Kiểm tra JPA queries:**
- Xem có `N+1 query problem` không
- Xem có lazy loading issues không

## 📝 **Giải thích fix:**

### **1. @JsonManagedReference + @JsonBackReference:**
- **User** (parent) → `@JsonManagedReference` → serialize expenses
- **Expense** (child) → `@JsonBackReference` → không serialize user

### **2. DTOs:**
- Tách biệt Entity và Response
- Chỉ serialize những field cần thiết
- Tránh circular reference hoàn toàn

### **3. Mappers:**
- Convert Entity → DTO
- Control chính xác data được trả về

### **4. @Transactional:**
- Đảm bảo lazy loading hoạt động đúng
- Tránh LazyInitializationException

---

**🎯 Kết quả mong đợi: Clean JSON responses không có circular reference!**
