const Category = require('../Models/CategoryModel');

// GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['category_name', 'ASC']],
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};