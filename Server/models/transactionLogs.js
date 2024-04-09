const mongoose = require('mongoose');
const moment = require('moment-timezone');
const IST_TIMEZONE = 'Asia/Kolkata';
const IST_TIMEZONE_OFFSET = 5.5 * 60 * 60 * 1000;

// Function to get the current time in IST
function getCurrentISTTime() {
    return moment().tz(IST_TIMEZONE).format();
}

const transactionLogsSchema = new mongoose.Schema({
    entry: {
        location: {
            type: {
                type: String,
                enum: ['Point'], // Only allow 'Point' type for GeoJSON
                required: true
            },
            coordinates: {
                type: [Number], // Array of numbers for longitude and latitude
                required: true
            }
        },
        time: {
            type: Date,
            default: () => new Date(Date.now() + IST_TIMEZONE_OFFSET),
            required: true
        }
    },
    exit: {
        location: {
            type: {
                type: String,
                enum: ['Point'], // Only allow 'Point' type for GeoJSON
                required: true
            },
            coordinates: {
                type: [Number], // Array of numbers for longitude and latitude
                default: [0, 0],
                required: true
            }
        },
        time: {
            type: Date,
            default: () => new Date(Date.now() + IST_TIMEZONE_OFFSET),
            required: true
        }
    },
    tollPaid: {
        type: Number,
        default: 0,
        required: true
    },
    customerId: {
        type: String,
        default: 0,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    }
});

transactionLogsSchema.index({ 'entry.location.coordinates': '2dsphere', 'exit.location.coordinates': '2dsphere' });

const transactionLogs = mongoose.model('transactionLogs', transactionLogsSchema);

module.exports = transactionLogs;
