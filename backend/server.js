require('dotenv').config();
const express = require('express');
const db = require('./utils/mongo');
const app = express();
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const corsOptions = {
    origin : 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/',routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

PORT = 5000
app.listen(PORT,()=>{
    db();
    console.log('Connected to MongoDB');
    console.log(`Server is running on port http://localhost:${PORT}`);
})