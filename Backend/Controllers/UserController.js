const bcrypt = require('bcryptjs');
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
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { full_name, email, phone, current_password, new_password } = req.body;

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
