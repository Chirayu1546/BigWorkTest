const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
  order_id: { type: DataTypes.INTEGER, allowNull: false, },
  product_id: { type: DataTypes.INTEGER, },
  product_name: { type: DataTypes.STRING, allowNull: false, },
  quantity: { type: DataTypes.INTEGER, allowNull: false, },
  unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false, }
}, {
  tableName: 'order_items',
  timestamps: false,
});

module.exports = OrderItem;
