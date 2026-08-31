const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserController');
const multer = require('multer');
const path = require('path');
const { authenticate, requireAdmin } = require('../Middleware/authMiddleware');

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
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

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
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 avatar_url:
 *                   type: string
 *       401:
 *         description: Unauthorized
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
 *         description: User ID
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
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     full_name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the profile owner)
 *       404:
 *         description: User not found
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
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Avatar uploaded successfully"
 *                 avatar_url:
 *                   type: string
 *                   example: "/uploads/1735300000000.jpg"
 *       400:
 *         description: No file uploaded or invalid file type
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the profile owner)
 *       404:
 *         description: User not found
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
 *         description: User ID
 *     responses:
 *       200:
 *         description: Avatar removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Avatar removed successfully"
 *       400:
 *         description: No avatar to delete
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the profile owner)
 *       404:
 *         description: User not found
 */
router.delete('/profile/:id/avatar', authenticate, requireOwnProfile, userController.deleteAvatar);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   full_name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [admin, user]
 *                   profile_picture:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, requireAdmin, userController.getAllUsers);

module.exports = router;
