require('dotenv').config();
const bcrypt = require('bcrypt');
const token = require('../utils/token'); 
const Usermodel = require('../Schemas/Users');

const Signup = async (req, res) => {
    const { name , email, password } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });

    try {
        // Check if user already exists
        const userExists = await Usermodel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await Usermodel.create({
            name,
            email,
            password: hashedPassword
        });

        console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
        console.log('User object for token:', {
            _id: user._id,
            name: user.name,
            email: user.email
        });

        // Generate auth token
        const authToken = await token(user);
        console.log('Generated token:', authToken ? 'Token generated successfully' : 'Token is undefined');

        // Set cookie
        res.cookie('token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: "User created successfully",
            token: authToken, //  token 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

        
    } catch (error) {
        console.error('Error during signup:', error);
        
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = Signup;