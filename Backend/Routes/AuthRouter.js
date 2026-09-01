const express = require('express');
const router = express.Router();
const authController = require('../Controllers/AuthController');
const { authenticate } = require('../Middleware/authMiddleware');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid input (validation error)
 *       409:
 *         description: Email or username already exists
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     description: Public endpoint. A successful response automatically authorizes Swagger UI with the returned JWT.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Registered username
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     profile_picture:
 *                       type: string
 *                       nullable: true
 *                       example: "image"
 *       400:
 *         description: Missing or invalid request fields
 *       401:
 *         description: Invalid username or password
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the authenticated user's account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user retrieved successfully
 *       401:
 *         description: Missing, invalid, or expired JWT
 *       404:
 *         description: User not found
 */
router.get('/me', authenticate, authController.me);

/**
 * @swagger
 * /api/auth/verify-pin:
 *   post:
 *     summary: Verify Admin PIN Code
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pin
 *             properties:
 *               pin:
 *                 type: string
 *                 example: "123456"
 *                 description: 4 to 6 digits Admin PIN
 *     responses:
 *       200:
 *         description: PIN verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "ยืนยัน PIN สำเร็จ"
 *       400:
 *         description: Missing PIN code
 *       401:
 *         description: Invalid Admin PIN or Unauthorized
 *       404:
 *         description: Admin PIN not configured in system
 */
router.post('/verify-pin', authenticate, authController.verifyAdminPin);

module.exports = router;