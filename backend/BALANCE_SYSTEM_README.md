# Hệ Thống Balance Tự Động

## Tổng Quan
Hệ thống balance tự động cập nhật số dư của user dựa trên các thao tác với expense (thêm, sửa, xóa).

## Nguyên Lý Hoạt Động

### 1. Quy Tắc Cập Nhật Balance

#### ExpenseType.INCOME
- **Khi thêm**: Cộng vào balance
- **Khi sửa**: Trừ balance cũ, cộng balance mới
- **Khi xóa**: Trừ khỏi balance

#### ExpenseType.EXPENSE  
- **Khi thêm**: Trừ khỏi balance
- **Khi sửa**: Cộng balance cũ, trừ balance mới
- **Khi xóa**: Cộng vào balance

#### ExpenseType.CASH
- **Không ảnh hưởng đến balance** trong mọi trường hợp

### 2. Ví Dụ Minh Họa

#### Kịch Bản 1: Thêm Expenses
```
User mới: Balance = 0

1. Thêm INCOME 1,000,000 → Balance = 1,000,000
2. Thêm EXPENSE 200,000 → Balance = 800,000  
3. Thêm CASH 50,000 → Balance = 800,000 (không đổi)
```

#### Kịch Bản 2: Sửa Expense
```
Trước khi sửa: Balance = 800,000

Sửa INCOME 1,000,000 thành EXPENSE 1,000,000:
- Trừ INCOME cũ: Balance = 800,000 - 1,000,000 = -200,000
- Cộng EXPENSE mới: Balance = -200,000 - 1,000,000 = -1,200,000
```

#### Kịch Bản 3: Xóa Expense
```
Trước khi xóa: Balance = -1,200,000

Xóa EXPENSE 200,000:
- Cộng lại EXPENSE đã xóa: Balance = -1,200,000 + 200,000 = -1,000,000
```

## Cấu Trúc Code

### 1. Models
- **User**: Chứa trường `balance` (BigDecimal)
- **Expense**: Chứa trường `expenseType` (String)
- **ExpenseType**: Enum định nghĩa các loại expense

### 2. Services
- **BalanceService**: Xử lý logic cập nhật balance
- **ExpenseService**: Tích hợp với BalanceService để tự động cập nhật

### 3. Controllers
- **BalanceController**: API endpoints để quản lý balance

## API Endpoints

### Balance Management
```
GET /api/balance/current          - Lấy balance hiện tại
GET /api/balance/summary          - Lấy thông tin chi tiết balance
POST /api/balance/sync            - Đồng bộ balance với expenses
POST /api/balance/check-sufficient - Kiểm tra balance có đủ không
```

### Expense Management (Tự động cập nhật balance)
```
POST /api/expenses                - Tạo expense mới
PUT /api/expenses/{id}            - Sửa expense
DELETE /api/expenses/{id}         - Xóa expense
```

## Tính Năng Đặc Biệt

### 1. Đồng Bộ Balance
- Tự động tính toán balance dựa trên tất cả expenses
- Sửa lỗi nếu balance bị sai lệch
- Endpoint: `POST /api/balance/sync`

### 2. Kiểm Tra Balance Đủ
- Kiểm tra xem user có đủ tiền để thực hiện expense không
- Endpoint: `POST /api/balance/check-sufficient`

### 3. Validation
- Kiểm tra expenseType hợp lệ
- Sử dụng BigDecimal để tránh lỗi tính toán số thập phân
- Transaction để đảm bảo tính nhất quán

## Bảo Mật

### 1. Authentication
- Tất cả endpoints yêu cầu JWT token
- User chỉ có thể truy cập balance của chính mình

### 2. Authorization
- Kiểm tra user ownership trước khi thao tác
- Validation dữ liệu đầu vào

## Xử Lý Lỗi

### 1. Lỗi Thường Gặp
- ExpenseType không hợp lệ
- User không tồn tại
- Balance âm (cho phép để hiển thị nợ)

### 2. Recovery
- Endpoint sync để sửa lỗi balance
- Logging để debug
- Transaction rollback nếu có lỗi

## Monitoring & Debug

### 1. Logging
- Log tất cả thay đổi balance
- Log lỗi và exception

### 2. Metrics
- Theo dõi số lần cập nhật balance
- Theo dõi thời gian xử lý

## Best Practices

### 1. Performance
- Sử dụng transaction để đảm bảo consistency
- Index trên các trường thường query

### 2. Scalability
- Có thể cache balance nếu cần
- Batch update balance nếu có nhiều thay đổi

### 3. Maintenance
- Định kỳ sync balance để đảm bảo accuracy
- Backup dữ liệu balance

## Testing

### 1. Unit Tests
- Test logic cập nhật balance
- Test các trường hợp edge case

### 2. Integration Tests
- Test toàn bộ flow từ API đến database
- Test transaction rollback

### 3. Load Tests
- Test performance với nhiều user
- Test concurrent updates

## Deployment

### 1. Database Migration
- Đảm bảo trường balance có trong bảng users
- Set default value = 0

### 2. Configuration
- Cấu hình transaction timeout
- Cấu hình logging level

### 3. Monitoring
- Set up alerts cho balance anomalies
- Monitor API response time
