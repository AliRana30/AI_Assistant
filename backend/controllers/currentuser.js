// routes/user.js or similar
const jwt = require('jsonwebtoken');
const User = require('../Schemas/Users');

const currentUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching current user:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { currentUser };
