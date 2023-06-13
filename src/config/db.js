const mongoose = require('mongoose');

require("dotenv").config();

// Retrieve the MongoDB connection URL from the environment variables
const MONGO_URL = process.env.MONGODB_URL;

// Log a message when the MongoDB connection is open
mongoose.connection.once('open', () => console.log('Connection....'));

// Log an error message if there is an error in the MongoDB connection
mongoose.connection.on('error', err => console.error('An unexpected error occurred. Please refresh the application'));

// Function to connect to the MongoDB database
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
    } catch (error) {
        console.error('An unexpected error occurred. Please refresh the application');
    }
}

module.exports = connectDB;