const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/OrderController');
const { authenticate } = require('../Middleware/authMiddleware');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (Checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               shipping_address:
 *                 type: string
 *                 example: "123 Moo 4, Khlong Luang, Pathum Thani"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: integer
 *                   example: 42
 *                 order_no:
 *                   type: string
 *                   example: "SO-20260829-A1B2C3D4"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *                 total_amount:
 *                   type: number
 *                   example: 599.00
 *                 OrderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                       product_name:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       unit_price:
 *                         type: number
 *                       subtotal:
 *                         type: number
 *       400:
 *         description: Invalid cart or item quantity
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: One or more products not found
 *       409:
 *         description: Insufficient stock for one or more items
 */
router.post('/', authenticate, orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a sales order by ID
 *     description: Returns the authenticated user's own sales order. Administrators can retrieve any sales order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Sales order ID
 *         schema:
 *           type: integer
 *           example: 42
 *     responses:
 *       200:
 *         description: Sales order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: integer
 *                 order_no:
 *                   type: string
 *                   example: "SO-20260829-A1B2C3D4"
 *                 order_date:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [pending, paid, shipped, completed, cancelled]
 *                 total_amount:
 *                   type: number
 *                 User:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     full_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 OrderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                       product_name:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       unit_price:
 *                         type: number
 *                       subtotal:
 *                         type: number
 *       400:
 *         description: Invalid order ID
 *       401:
 *         description: Missing, invalid, or expired JWT
 *       404:
 *         description: Order does not exist or is not accessible to this user
 */
router.get('/:id', authenticate, orderController.getOrderById);

module.exports = router;
