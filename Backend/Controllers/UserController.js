const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('../Models/UserModel');

// GET /api/users/profile/:id
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['user_id', 'username', 'email', 'full_name', 'phone', 'role', 'profile_picture', 'created_at']
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/users/profile/:id
exports.updateProfile = async (req, res) => {
  try {
    // req.user ต้องมาจาก auth middleware (verifyToken) — ถ้ายังไม่มีต้องเพิ่ม middleware นี้ก่อนเส้นทางนี้ใน routes
    if (!req.user || req.user.user_id !== parseInt(req.params.id, 10)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { full_name, email, phone, current_password, new_password, role } = req.body;

    // If changing password, verify current password first
    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const isMatch = await bcrypt.compare(current_password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(new_password, salt);
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use by another account' });
      }
      user.email = email;
    }

    // Update profile fields
    user.full_name = full_name || user.full_name;
    user.phone     = phone     ?? user.phone;

    // ── ROLE CHANGE ──────────────────────────────
    // เฉพาะ admin เท่านั้นที่เปลี่ยน role ตัวเองได้ / user ห้ามส่ง role มาแล้วมีผล
    if (role !== undefined && role !== user.role) {
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not allowed to change your role' });
      }

      const allowedRoles = ['admin', 'user'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      if (role === 'admin') {
        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount >= 2) {
          return res.status(400).json({ message: 'Maximum of 2 admins allowed' });
        }
      }

      user.role = role;
    }
    // ─────────────────────────────────────────────

    await user.save();

    res.json({
      user_id:   user.user_id,
      username:  user.username,
      email:     user.email,
      full_name: user.full_name,
      phone:     user.phone,
      profile_picture: user.profile_picture,
      role:      user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/users/profile/:id/avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save filename to database
    user.profile_picture = req.file.filename;
    await user.save();

    res.json({
      message: 'Avatar updated successfully',
      profile_picture: user.profile_picture
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/users/profile/:id/avatar
exports.deleteAvatar = async (req, res) => {
  try {
    if (!req.user || req.user.user_id !== parseInt(req.params.id, 10)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.profile_picture) {
      return res.status(400).json({ message: 'No avatar to delete' });
    }

    // ลบไฟล์จริงออกจาก disk (ไม่ให้ error ทำให้ทั้ง request ล้ม หากไฟล์หายไปแล้ว)
    const filePath = path.join(__dirname, '..', 'uploads', user.profile_picture);
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete avatar file:', err.message);
    });

    user.profile_picture = null;
    await user.save();

    res.json({ message: 'Avatar removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users  (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'username', 'email', 'full_name', 'phone', 'role', 'profile_picture', 'created_at'],
      order: [['created_at', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
