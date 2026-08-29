const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const Product = sequelize.define('Product', {
  product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
  category_id: { type: DataTypes.INTEGER, },
  product_name: { type: DataTypes.STRING, allowNull: false, },
  description: { type: DataTypes.TEXT, },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, },
  stock_qty: { type: DataTypes.INTEGER, defaultValue: 0 },
  image_url: { type: DataTypes.STRING, },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true, },
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Product;
