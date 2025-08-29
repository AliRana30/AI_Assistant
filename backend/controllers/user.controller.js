const User = require('../Schemas/Users');
const cloudinaryConfig = require('../utils/cloudinary');
const generateToken = require('../utils/token'); 


const updateAssistant = async (req, res) => {
  try {   

    const { assistantName } = req.body;
    const userId = req.user.id;

    if (!assistantName || assistantName.length < 3) {
      return res.status(400).json({ error: "Assistant name must be at least 3 characters long" });
    }

    let assistantImage = "";

    // Upload image to Cloudinary if file exists
    if (req.file) {
      assistantImage = await cloudinaryConfig(req.file.path); 
    }


    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          assistantName,
          assistantImage,
        },
      },
      { new: true }
    ).select("-password");

    // Generate new token
    const newToken = await generateToken(updatedUser);

    // Set token in cookie
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};


module.exports = updateAssistant;