require('dotenv').config();
const express = require('express');
const db = require('./utils/mongo');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Mount routes
app.get('/', (req, res) => {
  res.send('🟢 Express backend is live and working!');
});


app.use((req, res, next) => {
  console.log(`🛬 Received ${req.method} on ${req.url}`);
  next();
});

app.use('/', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  db();
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
