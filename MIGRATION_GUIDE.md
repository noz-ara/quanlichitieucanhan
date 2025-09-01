# Migration Guide: User-Specific Data Isolation

## Vấn đề đã được khắc phục

Trước đây, dự án ExpenseWise có vấn đề nghiêm trọng về bảo mật dữ liệu:
- **Tất cả user đều thấy chung một data** - không có sự phân tách dữ liệu giữa các tài khoản
- **Model Expense không có liên kết với User** - mối quan hệ `@ManyToOne` đã bị comment out
- **API không filter theo user** - tất cả endpoint đều trả về toàn bộ data
- **Không có xác thực user** trong các operation CRUD

## Các thay đổi đã thực hiện

### 1. Backend Changes

#### Model Updates
- **Expense.java**: Uncomment và sửa mối quan hệ `@ManyToOne` với User
- **User.java**: Uncomment mối quan hệ `@OneToMany` với Expense

#### Repository Updates
- **ExpenseRepository.java**: Thêm các method filter theo user:
  - `findByUserOrderByDateDesc(User user)`
  - `findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate)`
  - `findByUserAndCategoryOrderByDateDesc(User user, String category)`
  - `findByUserAndExpenseTypeOrderByDateDesc(User user, String expenseType)`
  - `countByUser(User user)`
  - `existsByIdAndUser(Long expenseId, User user)`

#### Service Updates
- **ExpenseService.java**: Cập nhật tất cả method để nhận User parameter và filter data theo user

#### Controller Updates
- **ExpenseController.java**: 
  - Thêm xác thực user cho tất cả operation
  - Thêm các endpoint mới:
    - `GET /expenses/my` - Lấy expenses của user hiện tại
    - `GET /expenses/my/category/{category}` - Lấy expenses theo category
    - `GET /expenses/my/type/{expenseType}` - Lấy expenses theo type
    - `GET /expenses/my/date-range` - Lấy expenses theo khoảng thời gian
    - `GET /expenses/my/count` - Đếm số expenses của user

### 2. Frontend Changes

#### ExpenseService Updates
- **ExpenseService.js**: Cập nhật để sử dụng các API endpoint mới
- Thêm các method mới:
  - `getMyExpenses()`
  - `getMyExpensesByCategory(category)`
  - `getMyExpensesByType(expenseType)`
  - `getMyExpensesByDateRange(startDate, endDate)`
  - `getMyExpenseCount()`

## Hướng dẫn Migration

### Bước 1: Backup Database
```bash
# Backup MySQL database
mysqldump -u root -p expenses > expenses_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Bước 2: Chạy Migration Script
```sql
-- Chạy file: backend/database_migration.sql
-- Hoặc chạy từng command:

-- 1. Thêm cột user_id
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id BIGINT;

-- 2. Gán existing expenses cho user mặc định (thay '1' bằng user ID thực tế)
UPDATE expenses SET user_id = 1 WHERE user_id IS NULL;

-- 3. Tạo foreign key constraint
ALTER TABLE expenses MODIFY COLUMN user_id BIGINT NOT NULL;
ALTER TABLE expenses ADD CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES users(id);

-- 4. Tạo index cho performance
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
```

### Bước 3: Restart Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Bước 4: Test API
```bash
# Test endpoint mới
curl -X GET "http://localhost:8080/expenses/my" \
  -H "Cookie: JSESSIONID=your_session_id"

# Test endpoint cũ (sẽ trả về tất cả data - chỉ dành cho admin)
curl -X GET "http://localhost:8080/expenses"
```

### Bước 5: Update Frontend Components
Cập nhật các component để sử dụng API mới:

```javascript
// Thay vì
const expenses = await ExpenseService.getAllExpenses();

// Sử dụng
const expenses = await ExpenseService.getMyExpenses();
```

## Kiểm tra sau Migration

### 1. Database Structure
```sql
-- Kiểm tra cấu trúc bảng
DESCRIBE expenses;

-- Kiểm tra foreign key
SHOW CREATE TABLE expenses;

-- Kiểm tra index
SHOW INDEX FROM expenses;
```

### 2. API Testing
- [ ] `GET /expenses/my` - Trả về expenses của user đã đăng nhập
- [ ] `POST /expenses` - Tạo expense mới với user_id được set tự động
- [ ] `PUT /expenses/{id}` - Chỉ update expense của user hiện tại
- [ ] `DELETE /expenses/{id}` - Chỉ delete expense của user hiện tại

### 3. Data Isolation
- [ ] User A chỉ thấy expenses của mình
- [ ] User B chỉ thấy expenses của mình
- [ ] Không có data leak giữa các user

## Troubleshooting

### Lỗi thường gặp

#### 1. Foreign Key Constraint Error
```sql
-- Nếu có lỗi foreign key, kiểm tra:
SELECT * FROM expenses WHERE user_id IS NULL;
SELECT * FROM users WHERE id = 1; -- Kiểm tra user mặc định có tồn tại không
```

#### 2. Authentication Error
```bash
# Kiểm tra session và authentication
# Đảm bảo user đã đăng nhập và có session hợp lệ
```

#### 3. CORS Error
```java
// Kiểm tra CORS configuration trong backend
// Đảm bảo frontend domain được allow
```

## Security Improvements

### 1. User Authentication
- Tất cả API endpoint đều yêu cầu authentication
- User chỉ có thể truy cập data của mình

### 2. Data Validation
- Kiểm tra user ownership trước mọi operation
- Sử dụng `existsByIdAndUser()` để đảm bảo security

### 3. API Endpoints
- `/expenses/my/*` - User-specific data (secure)
- `/expenses/*` - Admin operations (cần bảo mật thêm)

## Performance Considerations

### 1. Database Indexes
- `idx_expenses_user_id` - Tối ưu query theo user
- `idx_expenses_user_date` - Tối ưu query theo user và date

### 2. Query Optimization
- Sử dụng `findByUser*` methods thay vì filter sau khi query
- Lazy loading cho User relationship

## Next Steps

### 1. Admin Panel
- Tạo admin role và admin-specific endpoints
- Secure `/expenses` endpoint cho admin only

### 2. Advanced Filtering
- Thêm pagination cho large datasets
- Implement search functionality

### 3. Monitoring
- Log user actions
- Audit trail cho sensitive operations

## Support

Nếu gặp vấn đề trong quá trình migration, vui lòng:
1. Kiểm tra logs của backend
2. Verify database structure
3. Test API endpoints với Postman hoặc curl
4. Kiểm tra authentication và session
