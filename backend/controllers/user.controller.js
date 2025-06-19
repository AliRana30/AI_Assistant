const User = require('../Schemas/Users');
const cloudinaryConfig = require('../utils/cloudinary'); // Assuming you have a utility for handling file uploads
const generateToken = require('../utils/token'); // Assuming you have a utility for generating JWT tokens


const updateAssistant = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

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

    console.log("Updating user with:", assistantName, assistantImage);

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
    console.error("Update error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};


module.exports = updateAssistant;