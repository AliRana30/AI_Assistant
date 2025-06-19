const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  assistantName: {
    type: String,
    default: "AI Assistant"
  },
  assistantImage: {
    type: String,
    default: ""  
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Usermodel = mongoose.model('User', userSchema);
module.exports = Usermodel;
