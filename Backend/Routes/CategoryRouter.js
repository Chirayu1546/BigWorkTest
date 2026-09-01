const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/CategoryController');
const { authenticate } = require('../Middleware/authMiddleware');

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
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
 *         description: Category found
 *       404:
 *         description: Category not found
 */
router.get('/:id', authenticate, categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_name
 *             properties:
 *               category_name:
 *                 type: string
 *                 example: "ข้าว"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Category already exists
 */
router.post('/', authenticate, requireAdmin, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
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
 *             required:
 *               - category_name
 *             properties:
 *               category_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category already exists
 */
router.put('/:id', authenticate, requireAdmin, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
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
 *         description: Category deleted successfully
 *       400:
 *         description: Category still has products attached
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 */
router.delete('/:id', authenticate, requireAdmin, categoryController.deleteCategory);

module.exports = router;