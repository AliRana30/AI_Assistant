const bcrypt = require('bcrypt');
const token = require('../utils/token'); 
const User = require('../Schemas/Users');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    //  token generation
    const authToken = await token(user);

    // Set cookie
    res.cookie('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      token: authToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assistantName: user.assistantName,
        assistantImage: user.assistantImage,
      },
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = login;
