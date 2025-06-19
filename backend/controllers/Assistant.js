const User = require('../Schemas/Users');
const gemini = require('../gemini');
const moment = require('moment');

const assistant = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const userName = user.name;
    const assistantName = user.assistantName;
    const { command } = req.body;
    
    const response = await gemini(command, assistantName, userName);
    console.log('Gemini Response:', response); 

    if (!response) {
      return res.status(500).json({ message: "Gemini API failed" });
    }

    // Improved regex pattern to match JSON objects
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.log('Invalid JSON response:', response); 
      return res.status(400).json({ 
        message: "Invalid response from the assistant",
        details: "Response did not contain valid JSON"
      });
    }

    let geminiResult;
    try {
      geminiResult = JSON.parse(jsonMatch[0]);
      console.log('Parsed result:', geminiResult);
    } catch (err) {
      console.error("Parse Error:", err.message);
      console.log('Failed to parse:', jsonMatch[0]);
      return res.status(400).json({ 
        message: "JSON parsing failed",
        details: err.message 
      });
    }

    const type = geminiResult.type;
    if (!type) {
      return res.status(400).json({ message: "Response type not found" });
    }

    switch(type) {
      case 'get_date':
        return res.json({
          type,
          input: geminiResult.userInput,
          response: `current date is ${moment().format('YYYY-MM-DD')}`
        });
      case 'get_day':
        return res.json({
          type,
          input: geminiResult.userInput,
          response: `current day is ${moment().format('dddd')}`
        });
      case 'get_month':
        return res.json({
          type,
          input: geminiResult.userInput,
          response: `current month is ${moment().format('MMMM')}`
        });
      case 'get_time':
        return res.json({
          type,
          input: geminiResult.userInput,
          response: `current time is ${moment().format('HH:mm')}`
        });
      case 'general':
      case 'google_search':
      case 'youtube_search':
      case 'youtube_play':
      case 'calculator_open':
      case 'instagram_open':
      case 'facebook_open':
      case 'weather_show':
      case 'set_alarm':
      case 'tell_joke':
      case 'news_update':
      case 'send_email':
      case 'translate':
      case 'open_maps':
      case 'play_music':
      case 'set_reminder':
      case 'currency_convert':
      case 'unit_convert':
        return res.json({
          type,
          input: geminiResult.userInput,
          response: geminiResult.response
        });
      default:
        return res.status(400).json({ 
          message: "Cannot understand the command, try again",
          type: type 
        });
    }

  } catch (error) {
    console.error('Error details:', error);
    return res.status(500).json({ 
      message: "Internal Server Error",
      details: error.message
    });
  }
};

module.exports = assistant;
