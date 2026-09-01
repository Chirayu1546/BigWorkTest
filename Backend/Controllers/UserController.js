const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const User = require('../Models/UserModel');

// ฟังก์ชันช่วยลบไฟล์รูปภาพออกจาก Disk
const removeAvatarFile = async (filename) => {
  if (!filename) return;
  try {
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    await fs.unlink(filePath);
  } catch (err) {
    console.error('Failed to delete avatar file:', err.message);
  }
};

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
    const targetUserId = parseInt(req.params.id, 10);

    // ตรวจสอบสิทธิ์: ต้องเป็นเจ้าของบัญชี หรือเป็น Admin เท่านั้น
    if (!req.user || (req.user.user_id !== targetUserId && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findByPk(targetUserId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { full_name, email, phone, current_password, new_password, role } = req.body;
    const normalizedRole = role === 'user' ? 'employee' : role;

    // เปลี่ยนรหัสผ่าน
    if (new_password) {
      const isSelfUpdate = req.user.user_id === targetUserId;
      if (isSelfUpdate) {
        if (!current_password) {
          return res.status(400).json({ message: 'Current password is required to set a new password' });
        }
        const isMatch = await bcrypt.compare(current_password, user.password_hash);
        if (!isMatch) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }
      }
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(new_password, salt);
    }

    // ตรวจสอบ Email ซ้ำ
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use by another account' });
      }
      user.email = email;
    }

    // อัปเดตข้อมูลทั่วไป
    user.full_name = full_name ?? user.full_name;
    user.phone = phone ?? user.phone;

    // จัดการเปลี่ยน Role
    if (normalizedRole !== undefined && normalizedRole !== user.role) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not allowed to change user roles' });
      }

      const allowedRoles = ['admin', 'employee'];
      if (!allowedRoles.includes(normalizedRole)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      if (normalizedRole === 'admin') {
        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount >= 2) {
          return res.status(400).json({ message: 'Maximum of 2 admins allowed' });
        }
      }

      user.role = normalizedRole;
    }

    await user.save();

    res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      profile_picture: user.profile_picture,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/users/profile/:id/avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id, 10);

    if (!req.user || (req.user.user_id !== targetUserId && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findByPk(targetUserId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (user.profile_picture) {
      await removeAvatarFile(user.profile_picture);
    }

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
    const targetUserId = parseInt(req.params.id, 10);

    if (!req.user || (req.user.user_id !== targetUserId && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findByPk(targetUserId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.profile_picture) {
      return res.status(400).json({ message: 'No avatar to delete' });
    }

    await removeAvatarFile(user.profile_picture);

    user.profile_picture = null;
    await user.save();

    res.json({ message: 'Avatar removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

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

// ==========================================
// NEW FUNCTIONS ADDED BELOW
// ==========================================

// PUT /api/users/:id (admin only — แก้ไขข้อมูลผู้ใช้คนอื่น)
exports.adminUpdateUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { full_name, email, phone, role } = req.body;
    const normalizedRole = role === 'user' ? 'employee' : role;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use by another account' });
      }
      user.email = email;
    }

    user.full_name = full_name ?? user.full_name;
    user.phone = phone ?? user.phone;

    if (normalizedRole !== undefined && normalizedRole !== user.role) {
      const allowedRoles = ['admin', 'employee'];
      if (!allowedRoles.includes(normalizedRole)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      // กันไม่ให้ admin ลดสิทธิ์ตัวเองจากหน้าจัดการนี้
      if (req.user.user_id === user.user_id && normalizedRole !== 'admin') {
        return res.status(400).json({ message: 'Cannot change your own role from this page' });
      }

      if (normalizedRole === 'admin') {
        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount >= 2) {
          return res.status(400).json({ message: 'Maximum of 2 admins allowed' });
        }
      }

      if (user.role === 'admin' && normalizedRole !== 'admin') {
        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount <= 1) {
          return res.status(400).json({ message: 'At least 1 admin must remain' });
        }
      }

      user.role = normalizedRole;
    }

    await user.save();

    res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      profile_picture: user.profile_picture,
      role: user.role,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/users/:id (admin only)
exports.adminDeleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const targetId = parseInt(req.params.id, 10);
    if (req.user.user_id === targetId) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findByPk(targetId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'At least 1 admin must remain' });
      }
    }

    // ลบไฟล์รูปโปรไฟล์ออกจาก Disk ก่อนลบข้อมูลผู้ใช้
    if (user.profile_picture) {
      await removeAvatarFile(user.profile_picture);
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

