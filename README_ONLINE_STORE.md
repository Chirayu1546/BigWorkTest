# ระบบร้านค้าออนไลน์ (Online Store System)

สวัสดีครับ! ระบบร้านค้าออนไลน์ของคุณได้รับการพัฒนาเสร็จเรียบร้อยแล้ว โดยครอบคลุมฟีเจอร์ทั้งหมดที่ร้องขอ

## 📋 ฟีเจอร์ที่ได้รับการพัฒนา

### 1. ✅ จัดการสินค้า (2.1 Add, Edit, Delete Products)

#### ตำแหน่ง
- **URL**: `http://localhost:3000/manage-products`
- **หน้า**: `FrontEnd/src/pages/ManageProducts.jsx`
- **API**: `/api/products` (Backend)

#### ฟีเจอร์
- ✅ **เพิ่มสินค้า (Create)**: เพิ่มสินค้าใหม่พร้อมรายละเอียด
  - ชื่อสินค้า (Product Name) *
  - ราคา (Price) * - รองรับทศนิยม
  - สต็อก (Stock Quantity) *
  - URL รูปภาพ (Image URL) - ไม่บังคับ
  - รายละเอียดสินค้า (Description) - ไม่บังคับ

- ✅ **แก้ไขสินค้า (Update)**: แก้ไขข้อมูลสินค้าที่มีอยู่
  - ค้นหาสินค้า
  - กด "Edit" บนแถวสินค้า
  - แก้ไขข้อมูลและบันทึก

- ✅ **ลบสินค้า (Delete)**: ลบสินค้าออกจากระบบ
  - Soft Delete (ไม่ลบข้อมูลจริง เพียงแค่ปิดการใช้งาน)
  - กดปุ่ม Trash icon และยืนยัน

#### หน้าจออื่น
- ตารางแสดงสินค้าทั้งหมดพร้อมราคา สต็อก รูปภาพ
- ค้นหาสินค้าแบบ Real-time
- แสดงสถานะสต็อก (สีเขียว: พอ, สีส้ม: น้อย, สีแดง: หมด)
- Modal เพื่อเพิ่ม/แก้ไขสินค้า

---

### 2. ✅ ตะกร้าสินค้า (2.2 Add to Cart with Stock Deduction)

#### ตำแหน่ง
- **URL**: `http://localhost:3000/cart`
- **หน้า**: `FrontEnd/src/pages/Cart.jsx`
- **Context**: `FrontEnd/src/context/CartContext.jsx`

#### ฟีเจอร์
- ✅ **เลือกสินค้า**: ไปที่หน้า Products และกด "เพิ่มลงตะกร้า"
  - ตรวจสอบสต็อกอัตโนมัติ
  - แสดงข้อความเตือนถ้าสินค้าหมด
  - เก็บข้อมูลตะกร้าใน localStorage

- ✅ **จัดการจำนวน**: ปรับจำนวนสินค้าในตะกร้า
  - ปุ่ม + / - เพื่อเพิ่ม/ลดจำนวน
  - ตรวจสอบสต็อกอัตโนมัติ (ไม่ให้จำนวนเกินสต็อก)
  - ลบสินค้าออกจากตะกร้า

- ✅ **ตัดสต็อก (Stock Deduction)**: ที่เวลา Checkout
  - API: `POST /api/orders` ใช้ Transaction
  - ตรวจสอบสต็อกกระหว่าง Checkout
  - ลดจำนวนสต็อกอัตโนมัติ
  - ถ้าสต็อกไม่พอ ยกเลิกการสั่งซื้อ

#### หน้าจอ
- แสดงรายการสินค้าในตะกร้าแบบการ์ด
- แสดงรูปภาพ ชื่อ ราคา จำนวน รวม
- สรุปยอดรวมเงิน
- ปุ่ม "ดำเนินการสั่งซื้อ"

---

### 3. ✅ ใบสั่งขาย (2.3 Create Sales Order Invoice)

#### ตำแหน่ง
- **URL**: `http://localhost:3000/invoice/:orderId`
- **หน้า**: `FrontEnd/src/pages/Invoice.jsx`
- **API**: `GET /api/orders/:id` (Backend)

#### ฟีเจอร์
- ✅ **สร้างใบสั่งขาย**: เมื่อ Checkout สำเร็จ
  - ระบบสร้าง Order Number อัตโนมัติ (SO-YYYYMMDD-XXXXXXXX)
  - บันทึกรายการสินค้า
  - บันทึกราคารวม
  - บันทึกข้อมูลลูกค้า

- ✅ **แสดงใบสั่งขาย**: แม่แบบมืออาชีพจาก Microsoft Excel
  - **ที่อยู่ร้านค้า**: OnlineStore Co., Ltd.
  - **เลขที่สั่งซื้อ**: เลขที่เอกสาร
  - **วันที่**: วันที่สั่งซื้อ
  - **ข้อมูลลูกค้า**: ชื่อ อีเมล ที่อยู่
  - **ตารางสินค้า**: รายการสินค้า จำนวน ราคาต่อหน่วย รวม
  - **ยอดรวม**: ส่วนกลับกำไร ภาษี ยอดรวมสุดท้าย

#### ปุ่มและการใช้งาน
- ✅ **ปุ่มพิมพ์**: Print Invoice
  - คำนวณจาก CSS Media Print
  - สีพื้นหลังขาว สีตัวอักษรดำ (เหมาะสำหรับพิมพ์)
  - ลบปุ่มต่างๆ ออกเมื่อพิมพ์

- ✅ **ปุ่มกลับ**: กลับไปยังหน้าสินค้า

---

## 🛠️ โครงสร้างระบบ

### Backend (Node.js + Express + Sequelize + MySQL)
```
Backend/
├── Config/
│   ├── db.js              # การเชื่อมต่อ MySQL
│   └── swagger.js         # API Documentation
├── Models/
│   ├── UserModel.js       # ผู้ใช้
│   ├── CategoryModel.js   # หมวดหมู่
│   ├── ProductModel.js    # สินค้า
│   ├── OrderModel.js      # ใบสั่งซื้อ
│   └── OrderItemModel.js  # รายการสินค้าในใบสั่ง
├── Controllers/
│   ├── AuthController.js      # เข้าสู่ระบบ ลงทะเบียน
│   ├── ProductController.js   # จัดการสินค้า
│   ├── OrderController.js     # จัดการใบสั่ง
│   └── UserController.js      # จัดการผู้ใช้
├── Routes/
│   ├── AuthRouter.js      # เส้นทาง Authentication
│   ├── ProductRouter.js   # เส้นทาง สินค้า
│   ├── OrderRouter.js     # เส้นทาง ใบสั่ง
│   └── UserRouter.js      # เส้นทาง ผู้ใช้
├── Middleware/
│   └── authMiddleware.js  # JWT Authentication
├── .env                   # ตัวแปรสภาพแวดล้อม
├── server.js             # ไฟล์เริ่มต้น
└── package.json          # Dependencies
```

### Frontend (React + Vite)
```
FrontEnd/
├── src/
│   ├── pages/
│   │   ├── Products.jsx         # หน้าแสดงสินค้า + Add to Cart
│   │   ├── Cart.jsx             # หน้าตะกร้าสินค้า
│   │   ├── Invoice.jsx          # หน้าใบสั่งขาย
│   │   ├── ManageProducts.jsx   # หน้าจัดการสินค้า
│   │   ├── Login.jsx            # เข้าสู่ระบบ
│   │   ├── Register.jsx         # ลงทะเบียน
│   │   └── Profile.jsx          # ข้อมูลโปรไฟล์
│   ├── context/
│   │   ├── AuthContext.jsx      # บริหารจัดการ Authentication
│   │   ├── CartContext.jsx      # บริหารจัดการตะกร้า
│   │   └── ThemeContext.jsx     # บริหารจัดการธีม
│   ├── components/
│   │   ├── Sidebar.jsx          # แถบด้านข้าง
│   │   └── Topbar.jsx           # แถบด้านบน
│   ├── api/
│   │   └── axiosClient.js       # Axios Configuration
│   ├── App.jsx                  # แอปพลิเคชันหลัก
│   └── index.css                # CSS Styles
├── vite.config.js              # Vite Configuration
└── package.json                # Dependencies
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - ลงทะเบียนผู้ใช้ใหม่
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/me` - ดึงข้อมูลผู้ใช้ปัจจุบัน (ต้องมี Token)

### Products
- `GET /api/products` - ดึงรายการสินค้าทั้งหมด
- `POST /api/products` - เพิ่มสินค้าใหม่ (Admin only)
- `PUT /api/products/:id` - แก้ไขสินค้า (Admin only)
- `DELETE /api/products/:id` - ลบสินค้า (Admin only)

### Orders
- `POST /api/orders` - สร้างใบสั่งซื้อ (Checkout) ต้องมี Token
  ```json
  {
    "items": [
      { "product_id": 1, "quantity": 2 },
      { "product_id": 3, "quantity": 1 }
    ],
    "shipping_address": "123 Main St, Bangkok"
  }
  ```
- `GET /api/orders/:id` - ดึงรายละเอียดใบสั่ง ต้องมี Token

### Users
- `GET /api/users/:id` - ดึงข้อมูลผู้ใช้
- `PUT /api/users/:id` - อัปเดตข้อมูลผู้ใช้

---

## 🚀 วิธีการเรียกใช้งาน

### 1. สตาร์ท Backend

```bash
cd Backend
npm install
npm run dev
# หรือ npm start
```

ตรวจสอบว่า Server ทำงานที่ `http://localhost:5000`

**Swagger API Docs**: `http://localhost:5000/api-docs`

### 2. สตาร์ท Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

เข้าไป `http://localhost:5173` (หรือ `http://localhost:3000` ตามการตั้งค่า)

---

## 🔐 ผู้ใช้ทดสอบ

### Admin Account (สำหรับจัดการสินค้า)
- Username: `admin`
- Password: `admin123`

### Regular User (สำหรับซื้อสินค้า)
- Username: `user`
- Password: `user123`

### สร้างบัญชีใหม่
ให้ไปที่ `/register` เพื่อสร้างบัญชีใหม่

---

## 🔄 ขั้นตอนการซื้อสินค้า

1. **เข้าสู่ระบบ**
   - ไปที่ `/login`
   - ป้อนชื่อผู้ใช้และรหัสผ่าน

2. **เลือกสินค้า**
   - ไปที่ `/products`
   - เลือกสินค้าที่ต้องการ
   - กด "เพิ่มลงตะกร้า"
   - ระบบจะเก็บข้อมูลลงใน localStorage

3. **ตรวจสอบตะกร้า**
   - ไปที่ `/cart`
   - ปรับจำนวนสินค้า (หรือลบ)
   - ดูยอดรวมเงิน

4. **สั่งซื้อ (Checkout)**
   - กด "ดำเนินการสั่งซื้อ"
   - ระบบตรวจสอบสต็อก
   - ถ้า OK จะสร้างใบสั่ง และ **ตัดสต็อกอัตโนมัติ**
   - เปลี่ยนไปหน้า Invoice

5. **ดูใบสั่งขาย**
   - ระบบแสดงใบสั่งขายรูปแบบมืออาชีพ
   - สามารถพิมพ์ได้

---

## 🛡️ ความปลอดภัย

- ✅ JWT Token Authentication
- ✅ Password Hashing (bcryptjs)
- ✅ Admin Role Authorization
- ✅ Database Transactions (สำหรับ Checkout)
- ✅ Input Validation
- ✅ CORS Protection

---

## 💾 ฐานข้อมูล

ระบบใช้ MySQL/XAMPP โดยมีตารางดังนี้:

### users
- `user_id` (PK)
- `username`, `email` (Unique)
- `password_hash`
- `full_name`, `phone`, `profile_picture`
- `role` (user/admin)

### categories
- `category_id` (PK)
- `category_name`

### products
- `product_id` (PK)
- `category_id` (FK)
- `product_name`, `description`
- `price`, `stock_qty`
- `image_url`, `is_active`

### orders
- `order_id` (PK)
- `user_id` (FK)
- `order_no`, `order_date`
- `status`, `total_amount`
- `shipping_address`

### order_items
- `order_item_id` (PK)
- `order_id` (FK), `product_id` (FK)
- `product_name`, `quantity`
- `unit_price`, `subtotal`

---

## ⚙️ ตัวแปรสภาพแวดล้อม (.env)

Backend `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=test_db
DB_PORT=3306
JWT_SECRET=test_secret_key_2026
PORT=5000
```

---

## 🐛 Troubleshooting

### ไม่เชื่อมต่อ Database
- ตรวจสอบว่า XAMPP MySQL ทำงานอยู่
- ตรวจสอบชื่อฐานข้อมูล ชื่อผู้ใช้ รหัสผ่าน ใน `.env`

### Frontend ไม่โหลด
- ตรวจสอบว่า Backend ทำงานที่ `http://localhost:5000`
- ตรวจสอบ CORS settings ใน Backend

### Token หมดอายุ
- ลบ localStorage และเข้าสู่ระบบใหม่
- หรือรีเฟรชหน้าเว็บ

---

## 📝 หมายเหตุ

- ระบบใช้ **Soft Delete** สำหรับสินค้า (ไม่ลบข้อมูลจริง)
- สต็อกจะลดอัตโนมัติเมื่อ Checkout สำเร็จ
- ตะกร้าสินค้าถูกเก็บใน localStorage (ไม่สูญหายเมื่อรีเฟรช)
- ใบสั่งขายรองรับ Print ด้วย CSS Media Query

---

## ✨ แล้วเสร็จ!

ระบบของคุณสามารถใช้งานได้ทันที! 🎉

หากมีปัญหา หรือต้องการปรับปรุงเพิ่มเติม อย่าลังเล :)
