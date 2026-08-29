const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const Order = sequelize.define('Order', {
  order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
  user_id: { type: DataTypes.INTEGER, allowNull: false, },
  order_no: { type: DataTypes.STRING, allowNull: false, unique: true, },
  order_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, },
  status: { type: DataTypes.ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled'), defaultValue: 'pending', },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, },
  document_template: { type: DataTypes.STRING, },
  shipping_address: { type: DataTypes.TEXT, },
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Order;
