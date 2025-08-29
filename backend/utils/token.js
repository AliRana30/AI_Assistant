const jwt = require('jsonwebtoken');

const generateToken = async (user) => {
  try {
    
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };


    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
    return token;
  } catch (err) {
    throw new Error("Token generation failed: " + err.message);
  }
};

module.exports = generateToken;