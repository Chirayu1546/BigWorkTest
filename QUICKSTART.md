# 🚀 Quick Start Guide - ระบบร้านค้าออนไลน์

## ✅ ฟีเจอร์ที่พัฒนาเสร็จแล้ว

### 2.1 จัดการสินค้า (Add, Edit, Delete)
- ✅ เพิ่มสินค้า - `/manage-products` (Admin only)
- ✅ แก้ไขสินค้า - กด Edit บนรายการ
- ✅ ลบสินค้า - กด Delete และยืนยัน

### 2.2 ตะกร้าสินค้า (Add to Cart with Stock Deduction)
- ✅ เลือกสินค้า - `/products` -> Add to Cart
- ✅ จัดการจำนวน - ปรับเพิ่ม/ลดใน `/cart`
- ✅ ตัดสต็อก - อัตโนมัติเมื่อ Checkout สำเร็จ

### 2.3 ใบสั่งขาย (Sales Order Invoice)
- ✅ สร้างใบสั่ง - เมื่อ Checkout
- ✅ แสดงใบสั่ง - Template มืออาชีพจาก Microsoft Excel
- ✅ พิมพ์ใบสั่ง - ปุ่ม Print Invoice

---

## 🎯 เริ่มต้นใช้งาน

### ขั้นที่ 1: เปิด Backend
```bash
cd Backend
npm run dev
```
✓ Server ทำงานที่ `http://localhost:5000`

### ขั้นที่ 2: เปิด Frontend
```bash
cd FrontEnd
npm run dev
```
✓ Website ทำงานที่ `http://localhost:5173`

### ขั้นที่ 3: เข้าสู่ระบบ
- ไปที่ `/login`
- ใช้ Admin account: `admin` / `admin123`
- หรือ User account: `user` / `user123`

---

## 📌 เส้นทางต่างๆ (URLs)

| งาน | URL | บทบาท |
|-----|-----|--------|
| ดูสินค้า | `/products` | ทั้งหมด |
| ตะกร้า | `/cart` | ทั้งหมด |
| ใบสั่ง | `/invoice/:id` | ทั้งหมด |
| จัดการสินค้า | `/manage-products` | Admin |
| โปรไฟล์ | `/profile` | ทั้งหมด |
| API Docs | `http://localhost:5000/api-docs` | - |

---

## 🔑 API ที่สำคัญ

### เข้าสู่ระบบ
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### เพิ่มสินค้า (Admin only)
```bash
POST /api/products
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "product_name": "iPhone 15",
  "price": 35000,
  "stock_qty": 10,
  "category_id": 1,
  "description": "สมาร์ทโฟนล่าสุด"
}
```

### สั่งซื้อ (Checkout)
```bash
POST /api/orders
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ],
  "shipping_address": "123 Main St"
}
```

### ดึงใบสั่ง
```bash
GET /api/orders/42
Authorization: Bearer <TOKEN>
```

---

## 🛒 ขั้นตอนการซื้อสินค้าแบบเต็ม

```
1. Login → 2. Browse Products → 3. Add to Cart 
↓
4. Review Cart → 5. Checkout (ตัดสต็อก) 
↓
6. View Invoice → 7. Print Invoice
```

---

## 💡 ตัวอย่างการทดสอบ

### 1. Admin เพิ่มสินค้า
```
1. Login with admin/admin123
2. Go to /manage-products
3. Click "เพิ่มสินค้า"
4. Fill: ชื่อ, ราคา, สต็อก
5. Click บันทึก
```

### 2. User ซื้อสินค้า
```
1. Login with user/user123
2. Go to /products
3. Click "เพิ่มลงตะกร้า"
4. Go to /cart
5. Click "ดำเนินการสั่งซื้อ"
6. View Invoice
```

---

## 🗄️ Database Schema

```sql
-- users
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user'
);

-- products
CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_qty INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- orders
CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_no VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending','paid','shipped','completed','cancelled')
);

-- order_items
CREATE TABLE order_items (
  order_item_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);
```

---

## ⚠️ ข้อควรจำ

- ✅ XAMPP MySQL ต้องทำงานอยู่
- ✅ Backend ต้อง compile ก่อน Frontend
- ✅ Token หมดอายุหลัง 1 วัน
- ✅ localStorage ต้อง clear ถ้าเปลี่ยน user
- ✅ Print Invoice ใช้ CSS Media Print

---

## 📞 Support

หากมีปัญหา ตรวจสอบ:
1. Backend error ที่ console
2. Frontend error ที่ browser console
3. Database connection ใน XAMPP
4. API response ใน browser DevTools

---

**พัฒนาเสร็จแล้ว! สามารถใช้งานได้ทันที 🎉**
