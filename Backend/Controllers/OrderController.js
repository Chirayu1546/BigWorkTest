const crypto = require('crypto');
const Order = require('../Models/OrderModel');
const OrderItem = require('../Models/OrderItemModel');
const Product = require('../Models/ProductModel');
const User = require('../Models/UserModel');
const sequelize = require('../Config/db');

const orderNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `SO-${date}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

const checkoutError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

exports.createOrder = async (req, res) => {
  let transaction;

  try {
    const { items, shipping_address } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      throw checkoutError('Cart must contain at least one item', 400);
    }

    const quantities = new Map();
    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);
      if (!Number.isInteger(productId) || productId <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
        throw checkoutError('Each item must have a valid product_id and positive integer quantity', 400);
      }
      quantities.set(productId, (quantities.get(productId) || 0) + quantity);
    }

    transaction = await sequelize.transaction();
    const orderItems = [];
    let totalAmount = 0;

    for (const [productId, quantity] of quantities) {
      // Lock the product row so two checkouts cannot oversell the same stock.
      const product = await Product.findByPk(productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!product || !product.is_active) {
        throw checkoutError(`Product ${productId} is not available`, 404);
      }
      if (product.stock_qty < quantity) {
        throw checkoutError(`Insufficient stock for product ${product.product_name}`, 409);
      }

      const unitPrice = Number(product.price);
      const subtotal = Math.round(unitPrice * quantity * 100) / 100;
      totalAmount = Math.round((totalAmount + subtotal) * 100) / 100;
      orderItems.push({ product, quantity, unitPrice, subtotal });
    }

    const order = await Order.create({
      user_id: req.user.user_id,
      order_no: orderNumber(),
      total_amount: totalAmount,
      status: 'pending',
      document_template: 'microsoft-sales-invoice-simple-lines',
      shipping_address: typeof shipping_address === 'string' ? shipping_address.trim() || null : null,
    }, { transaction });

    for (const item of orderItems) {
      await item.product.update(
        { stock_qty: item.product.stock_qty - item.quantity },
        { transaction },
      );
      await OrderItem.create({
        order_id: order.order_id,
        product_id: item.product.product_id,
        product_name: item.product.product_name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
      }, { transaction });
    }

    await transaction.commit();
    const completeOrder = await Order.findByPk(order.order_id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['user_id', 'username', 'email', 'full_name', 'phone'] },
      ],
    });
    res.status(201).json(completeOrder);
  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback();
    console.error('Order creation failed:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Checkout failed' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const where = { order_id: orderId };
    if (req.user.role !== 'admin') where.user_id = req.user.user_id;

    const order = await Order.findOne({
      where,
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['user_id', 'username', 'email', 'full_name', 'phone'] },
      ],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('Order lookup failed:', error);
    res.status(500).json({ message: 'Unable to retrieve order' });
  }
};
