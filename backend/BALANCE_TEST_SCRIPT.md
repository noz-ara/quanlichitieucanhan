# Balance Test Script

## Mục đích
Test logic cập nhật balance tự động khi thêm/sửa/xóa expense.

## Quy tắc Balance
- **INCOME**: Cộng vào balance
- **EXPENSE**: Trừ khỏi balance  
- **CASH**: Không ảnh hưởng đến balance

## Test Cases

### 1. Test Tạo Expense Mới

#### 1.1 Tạo INCOME
```bash
curl -X POST "http://localhost:8080/api/expenses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000000,
    "category": "Lương",
    "description": "Lương tháng 1",
    "date": "2024-01-31",
    "expenseType": "INCOME"
  }'
```
**Kết quả mong đợi**: Balance tăng từ 0 lên 1,000,000

#### 1.2 Tạo EXPENSE
```bash
curl -X POST "http://localhost:8080/api/expenses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 200000,
    "category": "Ăn uống",
    "description": "Ăn trưa",
    "date": "2024-01-31",
    "expenseType": "EXPENSE"
  }'
```
**Kết quả mong đợi**: Balance giảm từ 1,000,000 xuống 800,000

#### 1.3 Tạo CASH
```bash
curl -X POST "http://localhost:8080/api/expenses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 50000,
    "category": "Tiền mặt",
    "description": "Rút tiền ATM",
    "date": "2024-01-31",
    "expenseType": "CASH"
  }'
```
**Kết quả mong đợi**: Balance không thay đổi (vẫn là 800,000)

### 2. Test Cập Nhật Expense

#### 2.1 Sửa INCOME thành EXPENSE
```bash
curl -X PUT "http://localhost:8080/api/expenses/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000000,
    "category": "Lương",
    "description": "Lương tháng 1",
    "date": "2024-01-31",
    "expenseType": "EXPENSE"
  }'
```
**Kết quả mong đợi**: 
- Trước: Balance = 800,000 (1,000,000 INCOME - 200,000 EXPENSE)
- Sau: Balance = -200,000 (0 INCOME - 1,000,000 EXPENSE - 200,000 EXPENSE)

### 3. Test Xóa Expense

#### 3.1 Xóa EXPENSE
```bash
curl -X DELETE "http://localhost:8080/api/expenses/2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Kết quả mong đợi**: Balance tăng từ -200,000 lên 0 (200,000 EXPENSE bị xóa)

### 4. Test Kiểm Tra Balance

#### 4.1 Lấy Balance Hiện Tại
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
- Khi sửa expense, balance cũ bị trừ, balance mới được cộng
- Khi xóa expense, balance được khôi phục

## Lưu Ý
- Đảm bảo JWT token hợp lệ
- Test theo thứ tự để balance được tính đúng
- Kiểm tra database để đảm bảo balance được lưu đúng
- Sử dụng BigDecimal để tránh lỗi tính toán số thập phân
