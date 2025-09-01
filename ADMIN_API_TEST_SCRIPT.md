# 🚀 ADMIN API TEST SCRIPT - USER MANAGEMENT ONLY

## 📋 **Yêu cầu:**
- JWT Token của user có role ADMIN
- Backend đang chạy trên `localhost:8080`
- Postman hoặc curl

## 🔑 **Setup JWT Token:**
```bash
# 1. Login với admin user
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# 2. Copy JWT token từ response
# 3. Sử dụng trong header: Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 👥 **USER MANAGEMENT (ADMIN)**

### **1. Lấy danh sách tất cả users**
```bash
curl -X GET "http://localhost:8080/api/admin/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response mẫu:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "username": "user1",
    "email": "user1@example.com",
    "role": "USER"
  }
]
```

### **2. Lấy thông tin user theo ID**
```bash
curl -X GET "http://localhost:8080/api/admin/users/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response mẫu:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

### **3. Tạo user mới**
```bash
curl -X POST "http://localhost:8080/api/admin/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "email": "newuser@example.com",
    "role": "USER"
  }'
```

**Response mẫu:**
```json
{
  "message": "User created successfully",
  "userId": 3,
  "username": "newuser"
}
```

### **4. Cập nhật thông tin user**
```bash
curl -X PUT "http://localhost:8080/api/admin/users/2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "updated@example.com",
    "role": "USER"
  }'
```

**Response mẫu:**
```json
{
  "message": "User updated successfully",
  "userId": 2
}
```

### **5. Xóa user**
```bash
curl -X DELETE "http://localhost:8080/api/admin/users/3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response mẫu:**
```json
{
  "message": "User deleted successfully",
  "deletedUserId": 3
}
```

### **6. Reset password user**
```bash
curl -X PATCH "http://localhost:8080/api/admin/users/2/reset-password" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "newPassword": "newpassword123"
  }'
```

**Response mẫu:**
```json
{
  "message": "Password reset successfully",
  "userId": 2
}
```

---

## 📊 **STATISTICS (ADMIN)**

### **1. Thống kê tổng quan về users**
```bash
curl -X GET "http://localhost:8080/api/admin/stats/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response mẫu:**
```json
{
  "totalUsers": 5,
  "adminUsers": 1,
  "regularUsers": 4
}
```

### **2. Tìm kiếm users**
```bash
# Tìm theo username
curl -X GET "http://localhost:8080/api/admin/users/search?username=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Tìm theo role
curl -X GET "http://localhost:8080/api/admin/users/search?role=USER" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Tìm theo email
curl -X GET "http://localhost:8080/api/admin/users/search?email=example.com" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response mẫu:**
```json
{
  "searchResults": [
    {
      "id": 2,
      "username": "user1",
      "email": "user1@example.com",
      "role": "USER"
    }
  ],
  "totalFound": 1
}
```

---

## 🔒 **SECURITY TESTING**

### **1. Test không có JWT Token**
```bash
curl -X GET "http://localhost:8080/api/admin/users"
# Expected: 401 Unauthorized
```

### **2. Test với JWT Token của user thường**
```bash
# Login với user thường
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user1",
    "password": "password123"
  }'

# Sử dụng token của user thường để gọi admin API
curl -X GET "http://localhost:8080/api/admin/users" \
  -H "Authorization: Bearer USER_JWT_TOKEN"
# Expected: 403 Forbidden
```

---

## 📝 **TEST SCENARIOS**

### **Scenario 1: Quản lý User cơ bản**
1. Tạo user mới với role USER
2. Lấy danh sách tất cả users
3. Cập nhật email của user
4. Reset password cho user
5. Xóa user

### **Scenario 2: Quản lý Role**
1. Tạo user với role ADMIN
2. Cập nhật role của user từ USER thành ADMIN
3. Kiểm tra thống kê users theo role

### **Scenario 3: Tìm kiếm và lọc**
1. Tạo nhiều users với thông tin khác nhau
2. Tìm kiếm theo username
3. Tìm kiếm theo email
4. Tìm kiếm theo role
5. Kiểm tra kết quả tìm kiếm

### **Scenario 4: Bảo mật**
1. Test không có JWT token
2. Test với token của user thường
3. Test với token của admin
4. Kiểm tra quyền truy cập

---

## ⚠️ **LƯU Ý QUAN TRỌNG**

1. **Privacy First**: Admin KHÔNG thể xem giao dịch cá nhân của users
2. **User Management Only**: Admin chỉ quản lý tài khoản user (tạo, sửa, xóa, reset password)
3. **Role-based Access Control**: Chỉ ADMIN mới có thể truy cập các endpoints này
4. **Data Protection**: Không trả về password, chỉ thông tin cơ bản
5. **Audit Trail**: Nên log lại tất cả thao tác của admin để theo dõi

---

## 🎯 **EXPECTED RESULTS**

- ✅ Tất cả admin endpoints trả về 200 OK với dữ liệu đúng
- ✅ User thường không thể truy cập admin endpoints (403 Forbidden)
- ✅ Không có JWT token trả về 401 Unauthorized
- ✅ Admin có thể tạo, sửa, xóa users
- ✅ Admin có thể reset password cho users
- ✅ Admin có thể xem thống kê tổng quan về users
- ✅ Admin có thể tìm kiếm và lọc users
- ✅ Admin KHÔNG thể xem giao dịch cá nhân của users
- ✅ Admin KHÔNG thể xem balance của users

---

## 🔐 **PRIVACY FEATURES**

1. **No Transaction Access**: Admin không thể xem income/expense/cash của users
2. **No Financial Data**: Admin không thể xem balance hay bất kỳ thông tin tài chính nào
3. **Limited User Info**: Chỉ hiển thị thông tin cơ bản (id, username, email, role)
4. **User Privacy**: Users có quyền riêng tư tuyệt đối về dữ liệu tài chính
