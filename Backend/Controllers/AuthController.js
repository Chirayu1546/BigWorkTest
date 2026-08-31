const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../Models/UserModel');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    const full_name = req.body.full_name?.trim();
    const phone = req.body.phone?.trim();

    if (!username || !email || typeof password !== 'string' || !full_name) {
      return res.status(400).json({ message: 'Username, email, full name and password are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({ message: 'Username must be between 3 and 50 characters' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username is already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    await User.create({
      username,
      email,
      password_hash,
      full_name,
      phone,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Email or username is already in use' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const password = req.body.password;

    if (!username || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT
    const payload = {
      user_id: user.user_id,
      role: user.role,
    };

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Authentication is not configured' });
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile_picture: user.profile_picture,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ['user_id', 'username', 'email', 'full_name', 'phone', 'role', 'profile_picture'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};