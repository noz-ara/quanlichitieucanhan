# 🧪 BILL & CONTACT TEST SCRIPT FOR POSTMAN

## 📋 **Prerequisites**
1. **Backend đang chạy** trên `http://localhost:8080`
2. **Database đã được setup** với các bảng cần thiết
3. **Có ít nhất 1 user** với role `USER` để test

---

## 🔐 **STEP 1: Authentication Setup**

### **1.1 Login để lấy JWT Token**
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "username": "your_username",
    "password": "your_password"
}
```

**Expected Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer"
}
```

**Save token vào Postman Environment Variable:**
- Variable: `jwt_token`
- Value: Copy từ response `token`

---

## 👥 **STEP 2: Contact Management Testing**

### **2.1 Thêm Contact mới**
```http
POST http://localhost:8080/contacts
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "name": "Nguyen Van A",
    "email": "nguyenvana@example.com"
}
```

**Expected Response (200):**
```json
{
    "id": 1,
    "name": "Nguyen Van A",
    "email": "nguyenvana@example.com"
}
```

### **2.2 Thêm Contact thứ 2**
```http
POST http://localhost:8080/contacts
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "name": "Tran Thi B",
    "email": "tranthib@example.com"
}
```

### **2.3 Thêm Contact thứ 3 (không có email)**
```http
POST http://localhost:8080/contacts
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "name": "Le Van C"
}
```

### **2.4 Lấy danh sách tất cả Contacts**
```http
GET http://localhost:8080/contacts
Authorization: Bearer {{jwt_token}}
```

**Expected Response (200):**
```json
[
    {
        "id": 3,
        "name": "Le Van C",
        "email": null
    },
    {
        "id": 2,
        "name": "Tran Thi B",
        "email": "tranthib@example.com"
    },
    {
        "id": 1,
        "name": "Nguyen Van A",
        "email": "nguyenvana@example.com"
    }
]
```

---

## 💰 **STEP 3: Bill Creation Testing**

### **3.1 Tạo Bill chia đều (EQUAL)**
```http
POST http://localhost:8080/bills
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "totalAmount": 900000,
    "splitType": "EQUAL",
    "participants": [
        {"userId": 1},
        {"contactId": 1},
        {"contactId": 2}
    ]
}
```

**Expected Response (200):**
```json
{
    "id": 1,
    "totalAmount": 900000,
    "splitType": "EQUAL",
    "paidBy": {
        "type": "USER",
        "id": 1,
        "name": "your_username"
    },
    "participants": [
        {
            "type": "USER",
            "id": 1,
            "name": "your_username",
            "amount": 300000,
            "percent": null
        },
        {
            "type": "CONTACT",
            "id": 1,
            "name": "Nguyen Van A",
            "amount": 300000,
            "percent": null
        },
        {
            "type": "CONTACT",
            "id": 2,
            "name": "Tran Thi B",
            "amount": 300000,
            "percent": null
        }
    ],
    "debts": [
        {
            "fromName": "Nguyen Van A",
            "toName": "your_username",
            "amount": 300000
        },
        {
            "fromName": "Tran Thi B",
            "toName": "your_username",
            "amount": 300000
        }
    ]
}
```

### **3.2 Tạo Bill chia theo phần trăm (PERCENT)**
```http
POST http://localhost:8080/bills
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "totalAmount": 1000000,
    "splitType": "PERCENT",
    "participants": [
        {"userId": 1, "percent": 50},
        {"contactId": 1, "percent": 30},
        {"contactId": 2, "percent": 20}
    ]
}
```

**Expected Response (200):**
```json
{
    "id": 2,
    "totalAmount": 1000000,
    "splitType": "PERCENT",
    "paidBy": {
        "type": "USER",
        "id": 1,
        "name": "your_username"
    },
    "participants": [
        {
            "type": "USER",
            "id": 1,
            "name": "your_username",
            "amount": 500000,
            "percent": 50
        },
        {
            "type": "CONTACT",
            "id": 1,
            "name": "Nguyen Van A",
            "amount": 300000,
            "percent": 30
        },
        {
            "type": "CONTACT",
            "id": 2,
            "name": "Tran Thi B",
            "amount": 200000,
            "percent": 20
        }
    ],
    "debts": [
        {
            "fromName": "Nguyen Van A",
            "toName": "your_username",
            "amount": 300000
        },
        {
            "fromName": "Tran Thi B",
            "toName": "your_username",
            "amount": 200000
        }
    ]
}
```

### **3.3 Tạo Bill chia theo số tiền cụ thể (CUSTOM)**
```http
POST http://localhost:8080/bills
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "totalAmount": 1500000,
    "splitType": "CUSTOM",
    "participants": [
        {"userId": 1, "amount": 500000},
        {"contactId": 1, "amount": 600000},
        {"contactId": 2, "amount": 400000}
    ]
}
```

**Expected Response (200):**
```json
{
    "id": 3,
    "totalAmount": 1500000,
    "splitType": "CUSTOM",
    "paidBy": {
        "type": "USER",
        "id": 1,
        "name": "your_username"
    },
    "participants": [
        {
            "type": "USER",
            "id": 1,
            "name": "your_username",
            "amount": 500000,
            "percent": null
        },
        {
            "type": "CONTACT",
            "id": 1,
            "name": "Nguyen Van A",
            "amount": 600000,
            "percent": null
        },
        {
            "type": "CONTACT",
            "id": 2,
            "name": "Tran Thi B",
            "amount": 400000,
            "percent": null
        }
    ],
    "debts": [
        {
            "fromName": "Nguyen Van A",
            "toName": "your_username",
            "amount": 600000
        },
        {
            "fromName": "Tran Thi B",
            "toName": "your_username",
            "amount": 400000
        }
    ]
}
```

### **3.4 Tạo Bill với người trả là Contact**
```http
POST http://localhost:8080/bills
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "totalAmount": 600000,
    "splitType": "EQUAL",
    "paidByContactId": 1,
    "participants": [
        {"contactId": 1},
        {"contactId": 2},
        {"contactId": 3}
    ]
}
```

**Expected Response (200):**
```json
{
    "id": 4,
    "totalAmount": 600000,
    "splitType": "EQUAL",
    "paidBy": {
        "type": "CONTACT",
        "id": 1,
        "name": "Nguyen Van A"
    },
    "participants": [
        {
            "type": "CONTACT",
            "id": 1,
            "name": "Nguyen Van A",
            "amount": 200000,
            "percent": null
        },
        {
            "type": "CONTACT",
            "id": 2,
            "name": "Tran Thi B",
            "amount": 200000,
            "percent": null
        },
        {
            "type": "CONTACT",
            "id": 3,
            "name": "Le Van C",
            "amount": 200000,
            "percent": null
        }
    ],
    "debts": [
        {
            "fromName": "Tran Thi B",
            "toName": "Nguyen Van A",
            "amount": 200000
        },
        {
            "fromName": "Le Van C",
            "toName": "Nguyen Van A",
            "amount": 200000
        }
    ]
}
```

---

## 📊 **STEP 4: Bill Retrieval Testing**

### **4.1 Lấy danh sách Bills của mình**
```http
GET http://localhost:8080/bills/my
Authorization: Bearer {{jwt_token}}
```

**Expected Response (200):**
```json
[
    {
        "id": 4,
        "totalAmount": 600000,
        "splitType": "EQUAL",
        "paidBy": {...},
        "participants": [...],
        "debts": [...]
    },
    {
        "id": 3,
        "totalAmount": 1500000,
        "splitType": "CUSTOM",
        "paidBy": {...},
        "participants": [...],
        "debts": [...]
    },
    {
        "id": 2,
        "totalAmount": 1000000,
        "splitType": "PERCENT",
        "paidBy": {...},
        "participants": [...],
        "debts": [...]
    },
    {
        "id": 1,
        "totalAmount": 900000,
        "splitType": "EQUAL",
        "paidBy": {...},
        "participants": [...],
        "debts": [...]
    }
]
```

### **4.2 Lấy chi tiết Bill cụ thể**
```http
GET http://localhost:8080/bills/1
Authorization: Bearer {{jwt_token}}
```

**Expected Response (200):** Same as bill creation response

---

## 🗑️ **STEP 5: Cleanup Testing**

### **5.1 Xóa Bill**
```http
DELETE http://localhost:8080/bills/1
Authorization: Bearer {{jwt_token}}
```

**Expected Response (204):** No Content

### **5.2 Xóa Contact**
```http
DELETE http://localhost:8080/contacts/1
Authorization: Bearer {{jwt_token}}
```

**Expected Response (204):** No Content

---

## ⚠️ **STEP 6: Error Testing**

### **6.1 Test tạo Bill không có participants**
```http
POST http://localhost:8080/bills
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "totalAmount": 100000,
    "splitType": "EQUAL",
    "participants": []
}
```

**Expected Response (400):** Bad Request

### **6.2 Test tạo Bill với số tiền âm**
```http
POST http://localhost:8080/bills
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "totalAmount": -100000,
    "splitType": "EQUAL",
    "participants": [
        {"userId": 1}
    ]
}
```

**Expected Response (400):** Bad Request

### **6.3 Test truy cập Bill không phải của mình**
```http
GET http://localhost:8080/bills/999
Authorization: Bearer {{jwt_token}}
```

**Expected Response (400):** Bad Request with "Access denied" message

---

## 🔍 **STEP 7: Edge Cases Testing**

### **7.1 Test PERCENT split với tổng % ≠ 100**
```http
POST http://localhost:8080/bills
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "totalAmount": 1000000,
    "splitType": "PERCENT",
    "participants": [
        {"userId": 1, "percent": 40},
        {"contactId": 1, "percent": 30}
    ]
}
```

### **7.2 Test CUSTOM split với tổng amount ≠ totalAmount**
```http
POST http://localhost:8080/bills
Authorization: Bearer {{jwt_token}}
Content-Type: application/json

{
    "totalAmount": 1000000,
    "splitType": "CUSTOM",
    "participants": [
        {"userId": 1, "amount": 300000},
        {"contactId": 1, "amount": 400000}
    ]
}
```

---

## 📝 **Test Results Summary**

| Test Case | Expected Result | Actual Result | Status |
|-----------|----------------|---------------|---------|
| Contact Creation | 200 OK | | ⏳ |
| Contact Retrieval | 200 OK | | ⏳ |
| Bill Creation (EQUAL) | 200 OK | | ⏳ |
| Bill Creation (PERCENT) | 200 OK | | ⏳ |
| Bill Creation (CUSTOM) | 200 OK | | ⏳ |
| Bill Retrieval | 200 OK | | ⏳ |
| Debt Calculation | Correct amounts | | ⏳ |
| Error Handling | 400/500 as expected | | ⏳ |

---

## 🚀 **Next Steps**

1. **Run all tests** và đánh dấu kết quả
2. **Verify debt calculations** có đúng không
3. **Test với real data** từ frontend
4. **Performance testing** với nhiều participants
5. **Integration testing** với các module khác

---

## 💡 **Tips for Testing**

- **Save JWT token** vào Postman Environment
- **Use variables** cho userId, contactId để dễ maintain
- **Test edge cases** để đảm bảo robustness
- **Verify business logic** đặc biệt là debt calculation
- **Check database** sau mỗi operation để verify data integrity
