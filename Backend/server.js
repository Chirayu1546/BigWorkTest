const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const sequelize = require('./Config/db');
const { swaggerSpec, swaggerUiOptions } = require('./Config/swagger');

// ===== Load Models =====
const User = require('./Models/UserModel');
const Category = require('./Models/CategoryModel');
const Product = require('./Models/ProductModel');
const Order = require('./Models/OrderModel');
const OrderItem = require('./Models/OrderItemModel');


// ===== Associations =====
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// ===== Routes =====
app.use('/api/auth', require('./Routes/AuthRouter'));
app.use('/api/products', require('./Routes/ProductRouter'));
app.use('/api/orders', require('./Routes/OrderRouter'));
app.use('/api/users', require('./Routes/UserRouter'));
app.use('/api/categories', require('./Routes/CategoryRouter'));
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('connected to Database successfully');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📄 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => console.error('❌ DB connection error:', err.message));