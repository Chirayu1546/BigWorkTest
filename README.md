# BigWorkTest
# ระบบร้านค้าออนไลน์ (Online Store System)

ระบบร้านค้าออนไลน์แบบ Full-stack พัฒนาด้วย React (Frontend) และ Node.js + Express + Sequelize (Backend)

---

## 📋 ฟีเจอร์หลัก

### 1. ระบบสมาชิกและสิทธิ์การใช้งาน
- สมัครสมาชิก / เข้าสู่ระบบ (JWT Authentication)
- 2 ระดับสิทธิ์: **Admin** และ **Employee**
- จัดการโปรไฟล์ส่วนตัว (แก้ไขข้อมูล, เปลี่ยนรหัสผ่าน, อัปโหลดรูปโปรไฟล์)
- Admin สามารถดูรายชื่อผู้ใช้ทั้งหมดและเปลี่ยน role ได้

### 2. จัดการสินค้า (Admin only)
- เพิ่ม / แก้ไข / ลบสินค้า (Soft Delete)
- จัดหมวดหมู่สินค้า (Category)
- อัปโหลด URL รูปภาพสินค้า
- ค้นหาสินค้าแบบ Real-time

### 3. ตะกร้าสินค้าและการสั่งซื้อ
- เลือกดูสินค้าตามหมวดหมู่
- เพิ่ม/ลด/ลบสินค้าในตะกร้า (เก็บใน localStorage)
- ตรวจสอบสต็อกอัตโนมัติ พร้อม popup แจ้งเตือนกรณีสต็อกไม่พอ
- Checkout พร้อมตัดสต็อกอัตโนมัติ (ใช้ Database Transaction)
- ปุ่มตะกร้าลอย (Floating Cart Button) มุมขวาล่างของหน้าจอ

### 4. ใบสั่งขาย (Invoice)
- สร้างใบสั่งขายอัตโนมัติหลัง Checkout สำเร็จ
- แสดงรายละเอียดสินค้า จำนวน ราคา ยอดรวม
- รองรับการพิมพ์ (Print) ด้วย CSS Media Print

### 5. ระบบแจ้งเตือน (Alert System)
- แจ้งเตือนแบบ popup กลางจอเมื่อเกิดข้อผิดพลาด พร้อมปุ่ม "ตกลง"
- ไม่มีการแจ้งเตือนรบกวนเมื่อดำเนินการสำเร็จตามปกติ

### 6. รองรับ 2 ภาษา (TH/EN) และ Dark/Light Mode

---

## 🛠️ โครงสร้างโปรเจกต์

### Backend (`/Backend`)
```
Backend/
├── Config/
│   ├── db.js                   # การเชื่อมต่อฐานข้อมูล MySQL
│   └── swagger.js              # ตั้งค่า API Documentation
├── Controllers/
│   ├── AuthController.js       # สมัครสมาชิก / เข้าสู่ระบบ
│   ├── CategoryController.js   # จัดการหมวดหมู่สินค้า
│   ├── OrderController.js      # จัดการคำสั่งซื้อ
│   ├── ProductController.js    # จัดการสินค้า
│   └── UserController.js       # จัดการผู้ใช้ / โปรไฟล์
├── Middleware/
│   └── authMiddleware.js       # authenticate, requireAdmin
├── Models/
│   ├── CategoryModel.js
│   ├── OrderItemModel.js
│   ├── OrderModel.js
│   ├── ProductModel.js
│   └── UserModel.js
├── Routes/
│   ├── AuthRouter.js
│   ├── CategoryRouter.js
│   ├── OrderRouter.js
│   ├── ProductRouter.js
│   └── UserRouter.js
├── uploads/                    # ไฟล์รูปโปรไฟล์ที่อัปโหลด
├── .env                        # ตัวแปรสภาพแวดล้อม (ไม่ commit ขึ้น git)
├── .gitignore
├── package.json
└── server.js                   # จุดเริ่มต้นของ Backend
```

### Frontend (`/FrontEnd`)
```
FrontEnd/
├── public/
├── src/
│   ├── api/
│   │   └── axiosClient.js      # ตั้งค่า Axios instance (baseURL, headers)
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── FloatingCartButton.jsx  # ปุ่มตะกร้าลอยมุมขวาล่าง
│   │   ├── Sidebar.jsx             # เมนูด้านซ้าย
│   │   └── Topbar.jsx              # แถบด้านบน (ภาษา, ธีม, โปรไฟล์)
│   ├── context/
│   │   ├── AlertContext.jsx    # popup แจ้งเตือนกลางจอ
│   │   ├── AuthContext.jsx     # จัดการสถานะผู้ใช้ / login / logout
│   │   ├── CartContext.jsx     # จัดการตะกร้าสินค้า
│   │   └── ThemeContext.jsx    # จัดการ Dark/Light mode
│   ├── pages/
│   │   ├── Cart.jsx            # หน้าตะกร้าสินค้า
│   │   ├── EmployeeList.jsx    # หน้ารายชื่อผู้ใช้ (Admin only)
│   │   ├── Invoice.jsx         # หน้าใบสั่งขาย
│   │   ├── Login.jsx           # หน้าเข้าสู่ระบบ
│   │   ├── ManageProducts.jsx  # หน้าจัดการสินค้า (Admin only)
│   │   ├── Products.jsx        # หน้าแสดงสินค้าทั้งหมด
│   │   ├── Profile.jsx         # หน้าโปรไฟล์ผู้ใช้
│   │   └── Register.jsx        # หน้าสมัครสมาชิก
│   ├── App.jsx                 # กำหนด Routes ทั้งหมด
│   ├── index.css                # Global styles / CSS variables
│   └── main.jsx                 # Entry point
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── .gitignore
```

---

## 📊 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/api/auth/register` | สมัครสมาชิกใหม่ |
| POST | `/api/auth/login` | เข้าสู่ระบบ (คืนค่า JWT token + ข้อมูล user) |

### Products (`/api/products`)
| Method | Endpoint | สิทธิ์ | คำอธิบาย |
|---|---|---|---|
| GET | `/api/products` | ทุกคน | ดึงรายการสินค้าที่ยัง active อยู่ (พร้อมข้อมูลหมวดหมู่) |
| POST | `/api/products` | Admin | เพิ่มสินค้าใหม่ |
| PUT | `/api/products/:id` | Admin | แก้ไขสินค้า |
| DELETE | `/api/products/:id` | Admin | ลบสินค้าแบบ Soft Delete (`is_active = false`) |

### Categories (`/api/categories`)
| Method | Endpoint | สิทธิ์ | คำอธิบาย |
|---|---|---|---|
| GET | `/api/categories` | ทุกคน | ดึงรายชื่อหมวดหมู่ทั้งหมด |

### Orders (`/api/orders`)
| Method | Endpoint | สิทธิ์ | คำอธิบาย |
|---|---|---|---|
| POST | `/api/orders` | ผู้ใช้ที่ login แล้ว | สร้างคำสั่งซื้อ (Checkout) พร้อมตัดสต็อกอัตโนมัติ |
| GET | `/api/orders/:id` | ผู้ใช้ที่ login แล้ว | ดึงรายละเอียดคำสั่งซื้อ (สำหรับหน้า Invoice) |

**ตัวอย่าง Request Body — สร้างคำสั่งซื้อ:**
```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ],
  "shipping_address": "123 ถนนสุขุมวิท กรุงเทพฯ"
}
```

### Users (`/api/users`)
| Method | Endpoint | สิทธิ์ | คำอธิบาย |
|---|---|---|---|
| GET | `/api/users` | Admin | ดึงรายชื่อผู้ใช้ทั้งหมด (สำหรับหน้า `/employees`) |
| GET | `/api/users/profile/:id` | เจ้าของ / Admin | ดึงข้อมูลโปรไฟล์ |
| PUT | `/api/users/profile/:id` | เจ้าของ / Admin | แก้ไขโปรไฟล์ / เปลี่ยนรหัสผ่าน / เปลี่ยน role (เฉพาะ Admin) |
| POST | `/api/users/profile/:id/avatar` | เจ้าของ / Admin | อัปโหลดรูปโปรไฟล์ |
| DELETE | `/api/users/profile/:id/avatar` | เจ้าของ / Admin | ลบรูปโปรไฟล์ |

**API Docs (Swagger):** `http://localhost:5000/api-docs`

---

## 📌 เส้นทางหน้าเว็บ (Frontend Routes)

| หน้า | URL | สิทธิ์ |
|---|---|---|
| สินค้า | `/products` | ผู้ใช้ที่ login แล้ว |
| ตะกร้าสินค้า | `/cart` | ผู้ใช้ที่ login แล้ว |
| ใบสั่งขาย | `/invoice/:orderId` | ผู้ใช้ที่ login แล้ว |
| จัดการสินค้า | `/manage-products` | Admin |
| จัดการผู้ใช้ | `/employees` | Admin |
| โปรไฟล์ | `/profile` | ผู้ใช้ที่ login แล้ว |
| เข้าสู่ระบบ | `/login` | สาธารณะ |
| สมัครสมาชิก | `/register` | สาธารณะ |

---

## 🗄️ Database Schema (สรุป)

```sql
users
  user_id (PK), username, email, password_hash,
  full_name, phone, profile_picture,
  role ENUM('admin', 'employee'), created_at

categories
  category_id (PK), category_name

products
  product_id (PK), category_id (FK),
  product_name, description, price, stock_qty,
  image_url, is_active

orders
  order_id (PK), user_id (FK), order_no, order_date,
  status, total_amount, shipping_address

order_items
  order_item_id (PK), order_id (FK), product_id (FK),
  product_name, quantity, unit_price, subtotal
```

---

## 🚀 วิธีติดตั้งและเริ่มต้นใช้งานโปรแกรม

### สิ่งที่ต้องมีก่อนเริ่ม (Prerequisites)
- [Node.js](https://nodejs.org/) เวอร์ชัน 18 ขึ้นไป
- MySQL Server (เช่น ผ่าน [XAMPP](https://www.apachefriends.org/))
- Git (ถ้าต้องการ clone โปรเจกต์)

### ขั้นตอนที่ 1: เตรียมฐานข้อมูล
1. เปิด XAMPP แล้ว Start service **MySQL**
2. สร้างฐานข้อมูลใหม่ (เช่น ผ่าน phpMyAdmin) ตั้งชื่อตามต้องการ เช่น `online_store_db`
3. ไม่ต้องสร้างตารางเอง เพราะ Sequelize จะสร้างให้อัตโนมัติตอนรัน server (ผ่าน `sequelize.sync()`)

### ขั้นตอนที่ 2: ติดตั้งและรัน Backend
```bash
cd Backend
npm install
```

สร้างไฟล์ `.env` ในโฟลเดอร์ `Backend/` (ถ้ายังไม่มี) แล้วใส่ค่าดังนี้:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=online_store_db
DB_PORT=3306
JWT_SECRET=ใส่ข้อความลับของคุณเอง
PORT=5000
```

รัน server:
```bash
node server.js
```
หรือถ้ามีตั้งค่า script ไว้ใน `package.json`:
```bash
npm run dev
```

ถ้าสำเร็จจะเห็นข้อความในเทอร์มินัลประมาณนี้:
```
connected to Database successfully
🚀 Server running on http://localhost:5000
📄 Swagger docs at http://localhost:5000/api-docs
```

### ขั้นตอนที่ 3: ติดตั้งและรัน Frontend
เปิดเทอร์มินัลใหม่อีกหน้าต่าง (แยกจาก Backend):
```bash
cd FrontEnd
npm install
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

### ขั้นตอนที่ 4: สร้างบัญชีผู้ใช้แรก
1. ไปที่หน้า `/register` เพื่อสมัครสมาชิก
2. บัญชีใหม่ทุกบัญชีจะได้ role `employee` เป็นค่าเริ่มต้น
3. หากต้องการบัญชี **Admin** คนแรก ให้ไปแก้ค่า `role` ของ user นั้นในฐานข้อมูลโดยตรง (ผ่าน phpMyAdmin) เป็น `admin` เพราะระบบยังไม่มีหน้าตั้งค่า Admin คนแรกอัตโนมัติ
4. หลังจากมี Admin คนแรกแล้ว Admin สามารถเข้าไปเปลี่ยน role ผู้ใช้คนอื่นได้ที่หน้า `/profile` (ของผู้ใช้คนนั้น) หรือดูรายชื่อทั้งหมดได้ที่ `/employees`

---

## 🔐 Role การใช้งาน

| Role | สิทธิ์ |
|---|---|
| **Admin** | จัดการสินค้า (`/manage-products`), จัดการผู้ใช้/พนักงาน (`/employees`), เปลี่ยน role ของตัวเอง, ทำทุกอย่างที่ Employee ทำได้ |
| **Employee** | ดูสินค้า, สั่งซื้อสินค้า, จัดการโปรไฟล์ของตัวเอง |

---

## 🔄 ขั้นตอนการสั่งซื้อสินค้า (สำหรับผู้ใช้ทั่วไป)

```
1. เข้าสู่ระบบ (/login)
   ↓
2. เลือกดูสินค้า (/products) — กรองตามหมวดหมู่ได้
   ↓
3. กดปุ่ม "เพิ่มลงตะกร้า" ที่สินค้าที่ต้องการ
   ↓
4. กดปุ่มตะกร้าลอยมุมขวาล่างของหน้าจอ เพื่อไปหน้าตะกร้า (/cart)
   ↓
5. ตรวจสอบ/ปรับจำนวนสินค้า แล้วกด "ดำเนินการสั่งซื้อ"
   ↓
6. ระบบตรวจสอบสต็อกและตัดสต็อกอัตโนมัติ
   ↓
7. ดู/พิมพ์ใบสั่งขาย (/invoice/:orderId)
```

## 🔄 ขั้นตอนการจัดการร้านค้า (สำหรับ Admin)

```
1. เข้าสู่ระบบด้วยบัญชี Admin
   ↓
2. ไปที่ /manage-products เพื่อเพิ่ม/แก้ไข/ลบสินค้า
   ↓
3. ไปที่ /employees เพื่อดูรายชื่อผู้ใช้ทั้งหมดในระบบ
   ↓
4. (ถ้าต้องการ) ไปที่โปรไฟล์ของผู้ใช้ที่ต้องการเปลี่ยน role
```

---

## 🛡️ ความปลอดภัย

- JWT Token Authentication
- Password Hashing ด้วย bcryptjs
- Role-based Authorization (`authenticate`, `requireAdmin` middleware) ฝั่ง Backend
- Database Transaction สำหรับ Checkout (ป้องกันข้อมูลสต็อกผิดพลาดกรณี error กลางทาง)
- Frontend Validation (username/password รับเฉพาะภาษาอังกฤษ ผ่าน HTML pattern + JS regex)
- **หมายเหตุ:** Validation ฝั่ง Frontend เป็นเพียงการช่วยเหลือผู้ใช้ (UX) เท่านั้น ตัวป้องกันจริงคือ Middleware ฝั่ง Backend

---

## 🐛 Troubleshooting

**เชื่อมต่อฐานข้อมูลไม่ได้**
- ตรวจสอบว่า MySQL/XAMPP ทำงานอยู่
- ตรวจสอบค่าต่างๆ ใน `.env` ให้ตรงกับฐานข้อมูลที่สร้างไว้

**Frontend เรียก API ไม่ได้ / ขึ้น 404**
- ตรวจสอบว่า Backend รันอยู่ที่ `http://localhost:5000`
- ตรวจสอบว่า route ถูก mount ใน `server.js` ครบทุกตัว (`/api/auth`, `/api/products`, `/api/categories`, `/api/orders`, `/api/users`)
- ตรวจสอบว่าไม่มีการ `require` ไฟล์ Middleware ซ้ำซ้อนในไฟล์ Router (ทำให้ server ไม่ขึ้นเลย)

**Token หมดอายุ / เข้าระบบไม่ได้**
- ลบ localStorage/sessionStorage ของเบราว์เซอร์แล้วเข้าสู่ระบบใหม่

**หน้าเว็บขึ้น 404 ตอน refresh หน้าที่ไม่ใช่หน้าแรก**
- เป็นพฤติกรรมปกติของ dev server กับ React Router ตอน refresh ตรงๆ ที่ path ย่อย ให้กด navigate ผ่านลิงก์ในเว็บแทน หรือปรับตั้งค่า dev server ให้ fallback ไปที่ `index.html`

---

## 📝 หมายเหตุสำคัญ

- สินค้าใช้ **Soft Delete** (ตั้ง `is_active = false` แทนการลบข้อมูลจริง)
- ตะกร้าสินค้าเก็บใน `localStorage` ไม่หายเมื่อรีเฟรชหน้า
- Role มี 2 แบบคือ `admin` และ `employee` เท่านั้น (ไม่มี `user` แล้ว)
- ระบบแจ้งเตือนใช้ popup กลางจอ (ผ่าน `AlertContext`) แทน toast มุมจอแบบเดิม
- รองรับการสลับภาษาไทย/อังกฤษและโหมดมืด/สว่างในแทบทุกหน้า
