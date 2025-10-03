const express = require('express');
const cors = require('cors');
require('dotenv').config({quiet:true});
const connectDB = require('./config/db');

// Route imports
const userRoutes = require('./routes/userRoutes');
const oAuth = require('./routes/oAuth');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

connectDB()
// API Routes
app.use('/api/users',userRoutes );
app.use('/api/oauth',oAuth );

// Root route
app.get('/', (req, res) => {
res.send(' server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});