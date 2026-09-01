const Category = require('../Models/CategoryModel');
const Product = require('../Models/ProductModel');

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

// GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/categories  (admin only)
exports.createCategory = async (req, res) => {
  try {
    const category_name = req.body.category_name?.trim();

    if (!category_name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    if (category_name.length > 100) {
      return res.status(400).json({ message: 'Category name is too long' });
    }

    const existing = await Category.findOne({ where: { category_name } });
    if (existing) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ category_name });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/categories/:id  (admin only)
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const category_name = req.body.category_name?.trim();
    if (!category_name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (category_name !== category.category_name) {
      const existing = await Category.findOne({ where: { category_name } });
      if (existing) {
        return res.status(409).json({ message: 'Category already exists' });
      }
    }

    category.category_name = category_name;
    await category.save();

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/categories/:id  (admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const productCount = await Product.count({ where: { category_id: category.category_id } });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete: ${productCount} product(s) still use this category`,
      });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};