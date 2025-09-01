# Complete CRUD Test Script for Income, Expense & Cash

## Mục đích
Test đầy đủ CRUD operations cho cả 3 loại: INCOME, EXPENSE, CASH với logic cập nhật balance tự động.

## Quy Tắc Balance
- **INCOME**: Cộng vào balance ✅
- **EXPENSE**: Trừ khỏi balance ✅  
- **CASH**: Không ảnh hưởng balance ✅

## API Endpoints

### Income Management
```
GET    /api/income/my                    - Lấy tất cả income
GET    /api/income/my/category/{cat}     - Lọc theo category
GET    /api/income/my/date-range         - Lọc theo thời gian
GET    /api/income/{id}                  - Lấy income theo ID
POST   /api/income                       - Tạo income mới
PUT    /api/income/{id}                  - Sửa income
DELETE /api/income/{id}                  - Xóa income
GET    /api/income/my/count              - Đếm số income
GET    /api/income/my/monthly/{y}/{m}    - Income theo tháng
GET    /api/income/my/yearly/{y}         - Income theo năm
```

### Expense Management
```
GET    /api/expenses/my                  - Lấy tất cả expenses
GET    /api/expenses/my/category/{cat}   - Lọc theo category
GET    /api/expenses/my/date-range       - Lọc theo thời gian
GET    /api/expenses/{id}                - Lấy expense theo ID
POST   /api/expenses                     - Tạo expense mới
PUT    /api/expenses/{id}                - Sửa expense
DELETE /api/expenses/{id}                - Xóa expense
GET    /api/expenses/my/count            - Đếm số expenses
GET    /api/expenses/my/monthly/{y}/{m}  - Expenses theo tháng
GET    /api/expenses/my/yearly/{y}       - Expenses theo năm
```

### Cash Management
```
GET    /api/cash/my                      - Lấy tất cả cash transactions
GET    /api/cash/my/category/{cat}       - Lọc theo category
GET    /api/cash/my/date-range           - Lọc theo thời gian
GET    /api/cash/{id}                    - Lấy cash theo ID
POST   /api/cash                         - Tạo cash transaction mới
PUT    /api/cash/{id}                    - Sửa cash transaction
DELETE /api/cash/{id}                    - Xóa cash transaction
GET    /api/cash/my/count                - Đếm số cash transactions
GET    /api/cash/my/monthly/{y}/{m}      - Cash theo tháng
GET    /api/cash/my/yearly/{y}           - Cash theo năm
```

### Balance Management
```
GET    /api/balance/current              - Lấy balance hiện tại
GET    /api/balance/summary              - Thông tin chi tiết balance
POST   /api/balance/sync                 - Đồng bộ balance
POST   /api/balance/check-sufficient     - Kiểm tra balance có đủ
```

## Test Cases

### 1. Test Income CRUD

#### 1.1 Tạo Income
```bash
curl -X POST "http://localhost:8080/api/income" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000000,
    "category": "Lương",
    "description": "Lương tháng 1",
    "date": "2024-01-31"
  }'
```
**Kết quả mong đợi**: 
- Income được tạo với expenseType = "INCOME"
- Balance tăng từ 0 lên 1,000,000

#### 1.2 Lấy Income
```bash
curl -X GET "http://localhost:8080/api/income/my" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 1.3 Sửa Income
```bash
curl -X PUT "http://localhost:8080/api/income/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1200000,
    "category": "Lương",
    "description": "Lương tháng 1 + thưởng",
    "date": "2024-01-31"
  }'
```
**Kết quả mong đợi**: 
- Balance cũ bị trừ: 1,000,000 → 0
- Balance mới được cộng: 0 + 1,200,000 = 1,200,000

#### 1.4 Xóa Income
```bash
curl -X DELETE "http://localhost:8080/api/income/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Kết quả mong đợi**: Balance giảm từ 1,200,000 xuống 0

### 2. Test Expense CRUD

#### 2.1 Tạo Expense
```bash
curl -X POST "http://localhost:8080/api/expenses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 200000,
    "category": "Ăn uống",
    "description": "Ăn trưa",
    "date": "2024-01-31"
  }'
```
**Kết quả mong đợi**: 
- Expense được tạo với expenseType = "EXPENSE"
- Balance giảm từ 0 xuống -200,000

#### 2.2 Lấy Expenses
```bash
curl -X GET "http://localhost:8080/api/expenses/my" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 2.3 Sửa Expense
```bash
curl -X PUT "http://localhost:8080/api/expenses/2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 250000,
    "category": "Ăn uống",
    "description": "Ăn trưa + cà phê",
    "date": "2024-01-31"
  }'
```
**Kết quả mong đợi**: 
- Balance cũ được cộng: -200,000 + 200,000 = 0
- Balance mới bị trừ: 0 - 250,000 = -250,000

#### 2.4 Xóa Expense
```bash
curl -X DELETE "http://localhost:8080/api/expenses/2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Kết quả mong đợi**: Balance tăng từ -250,000 lên 0

### 3. Test Cash CRUD

#### 3.1 Tạo Cash Transaction
```bash
curl -X POST "http://localhost:8080/api/cash" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 50000,
    "category": "Tiền mặt",
    "description": "Rút tiền ATM",
    "date": "2024-01-31"
  }'
```
**Kết quả mong đợi**: 
- Cash transaction được tạo với expenseType = "CASH"
- Balance không thay đổi (vẫn là 0)

#### 3.2 Lấy Cash Transactions
```bash
curl -X GET "http://localhost:8080/api/cash/my" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 3.3 Sửa Cash Transaction
```bash
curl -X PUT "http://localhost:8080/api/cash/3" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 75000,
    "category": "Tiền mặt",
    "description": "Rút tiền ATM + tiền lẻ",
    "date": "2024-01-31"
  }'
```
**Kết quả mong đợi**: Balance không thay đổi (vẫn là 0)

#### 3.4 Xóa Cash Transaction
```bash
curl -X DELETE "http://localhost:8080/api/cash/3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Kết quả mong đợi**: Balance không thay đổi (vẫn là 0)

### 4. Test Balance Operations

#### 4.1 Kiểm Tra Balance Hiện Tại
```bash
curl -X GET "http://localhost:8080/api/balance/current" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4.2 Lấy Balance Summary
```bash
curl -X GET "http://localhost:8080/api/balance/summary" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4.3 Đồng Bộ Balance
```bash
curl -X POST "http://localhost:8080/api/balance/sync" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4.4 Kiểm Tra Balance Có Đủ
```bash
curl -X POST "http://localhost:8080/api/balance/check-sufficient" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 500000
  }'
```

### 5. Test Advanced Features

#### 5.1 Income Theo Tháng
```bash
curl -X GET "http://localhost:8080/api/income/my/monthly/2024/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5.2 Expenses Theo Năm
```bash
curl -X GET "http://localhost:8080/api/expenses/my/yearly/2024" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5.3 Cash Theo Category
```bash
curl -X GET "http://localhost:8080/api/cash/my/category/Tiền%20mặt" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Kịch Bản Test Hoàn Chỉnh

### Bước 1: Tạo User Mới
```bash
curl -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Bước 2: Đăng Nhập
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Bước 3: Thực Hiện Test Cases
Thực hiện các test cases ở trên theo thứ tự.

### Bước 4: Kiểm Tra Kết Quả
- Balance phải được cập nhật đúng theo quy tắc
- CASH không ảnh hưởng đến balance
- Khi sửa, balance cũ bị trừ, balance mới được cộng
- Khi xóa, balance được khôi phục
- Tất cả CRUD operations hoạt động đúng

## Lưu Ý
- Đảm bảo JWT token hợp lệ
- Test theo thứ tự để balance được tính đúng
- Kiểm tra database để đảm bảo dữ liệu được lưu đúng
- Sử dụng BigDecimal để tránh lỗi tính toán số thập phân
- Mỗi controller chỉ xử lý đúng loại transaction của mình
