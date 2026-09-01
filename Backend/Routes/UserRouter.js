const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserController');
const multer = require('multer');
const path = require('path');
const { authenticate, requireAdmin } = require('../Middleware/authMiddleware');

// Middleware ตรวจสอบว่าเป็นเจ้าของโปรไฟล์หรือ Admin
const requireOwnProfile = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.user_id !== Number(req.params.id)) {
    return res.status(403).json({ message: 'You can only access your own profile' });
  }
  next();
};

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาด 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'));
  }
});

/* ==========================================================================
   USER PROFILE ROUTES (สำหรับผู้ใช้ทั่วไป / เจ้าของบัญชี)
   ========================================================================== */

/**
 * @swagger
 * /api/users/profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get('/profile/:id', authenticate, requireOwnProfile, userController.getProfile);

/**
 * @swagger
 * /api/users/profile/{id}:
 *   put:
 *     summary: Update user profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               current_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/profile/:id', authenticate, requireOwnProfile, userController.updateProfile);

/**
 * @swagger
 * /api/users/profile/{id}/avatar:
 *   post:
 *     summary: Upload or update user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Invalid file format
 *       401:
 *         description: Unauthorized
 */
router.post('/profile/:id/avatar', authenticate, requireOwnProfile, upload.single('avatar'), userController.uploadAvatar);

/**
 * @swagger
 * /api/users/profile/{id}/avatar:
 *   delete:
 *     summary: Remove user's profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Avatar removed successfully
 *       400:
 *         description: No avatar to delete
 *       401:
 *         description: Unauthorized
 */
router.delete('/profile/:id/avatar', authenticate, requireOwnProfile, userController.deleteAvatar);


/* ==========================================================================
   ADMIN MANAGEMENT ROUTES (เฉพาะ Admin เท่านั้น)
   ========================================================================== */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get('/', authenticate, requireAdmin, userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Admin update any user's profile or role (admin only)
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, employee]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request or role limits reached
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.put('/:id', authenticate, requireAdmin, userController.adminUpdateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user account (admin only)
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete self or last remaining admin
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.delete('/:id', authenticate, requireAdmin, userController.adminDeleteUser);

module.exports = router;