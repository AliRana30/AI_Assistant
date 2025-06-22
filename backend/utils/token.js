const jwt = require('jsonwebtoken');

const generateToken = async (user) => {
  try {
    console.log('JWT_SECRET in token utils:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET value:', process.env.JWT_SECRET ? 'Secret exists' : 'Secret is undefined');
    
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    console.log('Token payload:', payload);

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    console.log('Token generated successfully:', !!token);
    return token;
  } catch (err) {
    console.error("Error generating token:", err.message);
    throw new Error("Token generation failed: " + err.message);
  }
};

module.exports = generateToken;