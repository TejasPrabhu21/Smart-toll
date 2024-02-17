const mongoose = require('mongoose');
require('dotenv').config();

async function mongoConnect() {
    try {
        const mongoURI = process.env.MONGO_URI;
        const PORT = process.env.PORT;

        const connection = await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB...');

        return connection; // Return the Mongoose connection object
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        // You might want to throw the error here or implement retry logic
        throw err;
    }
}

module.exports = mongoConnect;
