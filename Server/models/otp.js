const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the time zone to Indian Standard Time (IST)
const IST_TIMEZONE = 'Asia/Kolkata';

const otpSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        // Function to calculate the expiration time 5 minutes from now in IST
        default: function () {
            return moment().tz(IST_TIMEZONE).add(5, 'minutes').toDate();
        },
        expires: 300 // OTP will expire after 5 minutes
    }
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
