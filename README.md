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
│   ├── db.js                   
│   └── swagger.js              
├── Controllers/
│   ├── AuthController.js       
│   ├── CategoryController.js   
│   ├── OrderController.js      
│   ├── ProductController.js    
│   └── UserController.js       
├── Middleware/
│   └── authMiddleware.js       
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
├── uploads/                    
├── .env                        
├── .gitignore
├── package.json
└── server.js                   
```

### Frontend (`/FrontEnd`)
```
FrontEnd/
├── public/
├── src/
│   ├── api/
│   │   └── axiosClient.js      
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── FloatingCartButton.jsx  
│   │   ├── Sidebar.jsx             
│   │   └── Topbar.jsx              
│   ├── context/
│   │   ├── AlertContext.jsx    
│   │   ├── AuthContext.jsx     
│   │   ├── CartContext.jsx     
│   │   └── ThemeContext.jsx    
│   ├── pages/
│   │   ├── Cart.jsx            
│   │   ├── EmployeeList.jsx    
│   │   ├── Invoice.jsx         
│   │   ├── Login.jsx           
│   │   ├── ManageProducts.jsx  
│   │   ├── Products.jsx        
│   │   ├── Profile.jsx         
│   │   └── Register.jsx        
│   ├── App.jsx                 
│   ├── index.css                
│   └── main.jsx                 
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── .gitignore
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

รัน server:
```bash
node server.js
```
หรือถ้ามีตั้งค่า script ไว้ใน `package.json`:
```bash
npm run dev
```

### ขั้นตอนที่ 3: ติดตั้งและรัน Frontend
เปิดเทอร์มินัลใหม่อีกหน้าต่าง (แยกจาก Backend):
```bash
cd FrontEnd
npm install
npm run dev
```
---


