const mongoose = require('mongoose');

const TollGateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { // GeoJSON object representing the coordinates of the toll gate
        type: {
            type: String,
            enum: ['Point'], // Only allow 'Point' type for GeoJSON
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers for longitude and latitude
            required: true,
        }
    }
});

// Create a 2dsphere index for the location.coordinates field
TollGateSchema.index({ 'location.coordinates': '2dsphere' });

// Create a Mongoose model for toll gates using the schema
const TollGate = mongoose.model('TollGate', TollGateSchema);

module.exports = TollGate; // Export the TollGate model for use in other files
