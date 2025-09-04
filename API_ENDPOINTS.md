## Danh sách Endpoint API

Lưu ý tiền tố đường dẫn:
- Auth: không có tiền tố `/api`
- Bills: `/bills`
- Contacts: `/contacts`
- Users: `/users`
- File: `/files`
- CSRF: `/csrf-token`
- Expense: `/api/expenses`
- Income: `/api/income`
- Cash: `/api/cash`
- Balance: `/api/balance`
- Admin: `/api/admin`

---

### AuthController
- POST `/login`
  - Input (body JSON):
    ```json
    { "username": "string", "password": "string" }
    ```
  - Output (200):
    ```json
    { "token": "string", "username": "string", "role": "string", "message": "Login successful!" }
    ```
  - Output (401): "Invalid username or password!"

- POST `/register` (multipart/form-data)
  - Input (form fields): `username` (string), `password` (string), `email` (string), `profileImage` (file, optional)
  - Output (200):
    ```json
    { "message": "User registered successfully!" }
    ```
  - Output (409):
    ```json
    { "message": "Username already exists", "suggestedUsernames": ["string", "..."] }
    ```
  - Output (500):
    ```json
    { "message": "Internal server error", "error": "string" }
    ```

- POST `/logout`
  - Output (200): "Logged out successfully!"

---

### ExpenseController (`/api/expenses`)
- GET `/api/expenses` (ADMIN)
  - Output (200): `ExpenseResponseDto[]`

- GET `/api/expenses/my`
  - Output (200): `ExpenseResponseDto[]`

- GET `/api/expenses/my/category/{category}`
  - Output (200): `ExpenseResponseDto[]`

- GET `/api/expenses/my/date-range?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd`
  - Query: `startDate`, `endDate` (LocalDate)
  - Output (200): `ExpenseResponseDto[]`

- GET `/api/expenses/{id}`
  - Output (200): `ExpenseResponseDto`
  - Output (404):
    ```json
    { "message": "Expense not found" }
    ```

- POST `/api/expenses`
  - Input (body JSON):
    ```json
    { "amount": 0, "category": "string", "description": "string", "date": "yyyy-MM-dd" }
    ```
  - Output (201): `ExpenseResponseDto`
  - Output (400):
    ```json
    { "message": "Validation failed", "errors": ["..."] }
    ```

- PUT `/api/expenses/{id}`
  - Input (body JSON): như create
  - Output (200): `ExpenseResponseDto`
  - Output (404): `{ "message": "Expense not found" }`
  - Output (400): như trên

- DELETE `/api/expenses/{id}`
  - Output (204) hoặc (404): `{ "message": "Expense not found" }`

- GET `/api/expenses/my/count`
  - Output (200):
    ```json
    { "count": 0, "userId": 0, "type": "EXPENSE" }
    ```

- GET `/api/expenses/my/monthly/{year}/{month}`
  - Output (200):
    ```json
    { "year": 0, "month": 0, "totalExpense": 0, "expenseCount": 0, "expenses": [ExpenseResponseDto] }
    ```

- GET `/api/expenses/my/yearly/{year}`
  - Output (200):
    ```json
    { "year": 0, "totalExpense": 0, "expenseCount": 0, "expenses": [ExpenseResponseDto] }
    ```

Schema `ExpenseResponseDto`:
```json
{
  "expense_id": 0,
  "amount": 0,
  "category": "string",
  "description": "string",
  "date": "yyyy-MM-dd",
  "expenseType": "EXPENSE|INCOME|CASH",
  "username": "string"
}
```

---

### IncomeController (`/api/income`)
- GET `/api/income/my`
  - Output (200): `ExpenseResponseDto[]`

- GET `/api/income/my/category/{category}`
  - Output (200): `ExpenseResponseDto[]`

- GET `/api/income/my/date-range?startDate&endDate`
  - Output (200): `ExpenseResponseDto[]`

- GET `/api/income/{id}`
  - Output (200): `ExpenseResponseDto`
  - Output (404): `{ "message": "Income not found" }`

- POST `/api/income`
  - Input (body JSON):
    ```json
    { "amount": 0, "category": "string", "description": "string", "date": "yyyy-MM-dd" }
    ```
  - Output (201): `ExpenseResponseDto` (expenseType = `INCOME`)

- PUT `/api/income/{id}` (body như create)
  - Output (200): `ExpenseResponseDto`
  - Output (404): `{ "message": "Income not found" }`

- DELETE `/api/income/{id}`
  - Output (204) hoặc 404 như trên

- GET `/api/income/my/count`
  - Output (200): `{ "count": 0, "userId": 0, "type": "INCOME" }`

- GET `/api/income/my/monthly/{year}/{month}`
  - Output (200): `{ "year": 0, "month": 0, "totalIncome": 0, "incomeCount": 0, "incomes": [ExpenseResponseDto] }`

- GET `/api/income/my/yearly/{year}`
  - Output (200): `{ "year": 0, "totalIncome": 0, "incomeCount": 0, "incomes": [ExpenseResponseDto] }`

---

### CashController (`/api/cash`)
- GET `/api/cash/my`
  - Output (200): `ExpenseResponseDto[]`

- GET `/api/cash/my/category/{category}`
  - Output (200): `ExpenseResponseDto[]`

- GET `/api/cash/my/date-range?startDate&endDate`
  - Output (200): `ExpenseResponseDto[]`

- GET `/api/cash/{id}`
  - Output (200): `ExpenseResponseDto`
  - Output (404): `{ "message": "Cash transaction not found" }`

- POST `/api/cash`
  - Input (body JSON):
    ```json
    { "amount": 0, "category": "string", "description": "string", "date": "yyyy-MM-dd" }
    ```
  - Output (201): `ExpenseResponseDto` (expenseType = `CASH`)

- PUT `/api/cash/{id}` (body như create)
  - Output (200): `ExpenseResponseDto`
  - Output (404): `{ "message": "Cash transaction not found" }`

- DELETE `/api/cash/{id}`
  - Output (204) hoặc 404 như trên

- GET `/api/cash/my/count`
  - Output (200): `{ "count": 0, "userId": 0, "type": "CASH" }`

- GET `/api/cash/my/monthly/{year}/{month}`
  - Output (200): `{ "year": 0, "month": 0, "totalCash": 0, "cashCount": 0, "cashTransactions": [ExpenseResponseDto] }`

- GET `/api/cash/my/yearly/{year}`
  - Output (200): `{ "year": 0, "totalCash": 0, "cashCount": 0, "cashTransactions": [ExpenseResponseDto] }`

---

### BillController (`/bills`)
- POST `/bills`
  - Input (body JSON):
    ```json
    {
      "totalAmount": 0,
      "paidByUserId": 0,
      "paidByContactId": 0,
      "splitType": "EQUAL|PERCENT|CUSTOM",
      "participants": [
        { "userId": 0, "contactId": 0, "percent": 0, "amount": 0 }
      ]
    }
    ```
  - Output (200) `BillResponse`:
    ```json
    {
      "id": 0,
      "totalAmount": 0,
      "splitType": "EQUAL|PERCENT|CUSTOM",
      "paidBy": { "type": "USER|CONTACT", "id": 0, "name": "string" },
      "participants": [
        { "type": "USER|CONTACT", "id": 0, "name": "string", "amount": 0, "percent": 0 }
      ],
      "debts": [ { "fromName": "string", "toName": "string", "amount": 0 } ]
    }
    ```

- GET `/bills/my`
  - Output (200): `Bill[]` (entity)

- GET `/bills/{id}`
  - Output (200): `BillResponse`

- DELETE `/bills/{id}`
  - Output (204)

---

### ContactController (`/contacts`)
- POST `/contacts`
  - Input (body JSON Contact):
    ```json
    { "name": "string", "email": "string" }
    ```
  - Output (200): `Contact` (entity)

- GET `/contacts`
  - Output (200): `Contact[]`

- DELETE `/contacts/{id}`
  - Output (204)

Schema `Contact`:
```json
{ "id": 0, "name": "string", "email": "string" }
```

---

### BalanceController (`/api/balance`)
- GET `/api/balance/current`
  - Output (200):
    ```json
    { "success": true, "balance": 0, "message": "Balance retrieved successfully" }
    ```
  - Output (400/500):
    ```json
    { "success": false, "message": "Error..." }
    ```

- POST `/api/balance/sync`
  - Output (200):
    ```json
    { "success": true, "balance": 0, "message": "Balance synchronized successfully" }
    ```

- POST `/api/balance/check-sufficient`
  - Input (body JSON):
    ```json
    { "amount": 0 }
    ```
  - Output (200):
    ```json
    {
      "success": true,
      "hasSufficientBalance": false,
      "currentBalance": 0,
      "requiredAmount": 0,
      "message": "Sufficient balance|Insufficient balance"
    }
    ```

- GET `/api/balance/summary`
  - Output (200):
    ```json
    {
      "success": true,
      "currentBalance": 0,
      "calculatedBalance": 0,
      "isBalanced": false,
      "message": "Balance summary retrieved successfully"
    }
    ```

---

### AdminController (`/api/admin`) (ROLE_ADMIN)
- GET `/api/admin/users`
  - Output (200): `[ { "id": 0, "username": "string", "email": "string", "role": "string" } ]`

- GET `/api/admin/users/{userId}`
  - Output (200): `{ "id": 0, "username": "string", "email": "string", "role": "string" }`
  - 404: `{ "message": "User not found" }`

- POST `/api/admin/users`
  - Input (body JSON):
    ```json
    { "username": "string", "password": "string", "email": "string", "role": "string" }
    ```
  - Output (201):
    ```json
    { "message": "User created successfully", "userId": 0, "username": "string" }
    ```
  - 400: `{ "message": "Username already exists" }`

- PUT `/api/admin/users/{userId}`
  - Input (body JSON, các trường: `email`, `role`, `password` tùy chọn)
  - Output (200): `{ "message": "User updated successfully", "userId": 0 }`
  - Output (200 nếu không đổi): `{ "message": "No changes made" }`
  - 404: `{ "message": "User not found" }`

- DELETE `/api/admin/users/{userId}`
  - Output (200): `{ "message": "User deleted successfully", "deletedUserId": 0 }`
  - 400: `{ "message": "Cannot delete admin user" }`
  - 404: `{ "message": "User not found" }`

- PATCH `/api/admin/users/{userId}/toggle-status`
  - Output (200): `{ "message": "User status toggle not implemented yet", "userId": 0 }`

- PATCH `/api/admin/users/{userId}/reset-password`
  - Input (body JSON): `{ "newPassword": "string" }`
  - Output (200): `{ "message": "Password reset successfully", "userId": 0 }`

- GET `/api/admin/stats/users`
  - Output (200): `{ "totalUsers": 0, "adminUsers": 0, "regularUsers": 0 }`

- GET `/api/admin/users/search?username=&email=&role=`
  - Query: tất cả tham số optional
  - Output (200): `{ "searchResults": [ { "id": 0, "username": "string", "email": "string", "role": "string" } ], "totalFound": 0 }`

---

### UserController (`/users`)
- GET `/users/admin`
  - Output (200): `User[]`

- GET `/users/user/id/{id}` (ROLE_USER)
  - Output (200): `User`

- GET `/users/user/{username}` (ROLE_USER)
  - Output (200): `User`

- GET `/users/user/profileImage/{fileName}` (ROLE_USER)
  - Output: ảnh bytes (Content-Type: image/jpeg)

- POST `/users/admin` (multipart/form-data)
  - Input: `user` (part, JSON của entity User), `profileImage` (file)
  - Output (200): `User` (đã lưu)
  - 400: lỗi validate theo field, hoặc trùng `username`/`email`

- PUT `/users/admin/{id}` (multipart/form-data)
  - Input: `userDetails` (part JSON), `profileImage` (file optional)
  - Output (200): `User` (cập nhật)

- DELETE `/users/admin/{id}`
  - Output: 200 (không body)

---

### FileController (`/files`)
- GET `/files/{fileId}`
  - Output: file stream (binary) với header `Content-Disposition: attachment; filename="..."`. Không trả JSON.

---

### CsrfTokenController
- GET `/csrf-token`
  - Output (200) (object CSRF):
    ```json
    { "headerName": "X-CSRF-TOKEN", "parameterName": "_csrf", "token": "string" }
    ```

---

### DTO body cho create/update (tham khảo)
- ExpenseCreateDTO/UpdateDTO, IncomeCreateDTO/UpdateDTO, CashCreateDTO/UpdateDTO:
  ```json
  { "amount": 0, "category": "string", "description": "string", "date": "yyyy-MM-dd" }
  ```

- BillCreateRequest: xem phần BillController.


