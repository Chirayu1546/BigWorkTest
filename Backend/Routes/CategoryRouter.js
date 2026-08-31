const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/CategoryController');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category_id:
 *                     type: integer
 *                   category_name:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', categoryController.getAllCategories);

module.exports = router;