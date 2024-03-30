const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        default: "",
        required: false
    },
    address: {
        type: String,
        default: "",
        required: false
    },
    balance: {
        type: Number,
        default: 0,
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    }
});

const userData = mongoose.model("userData", userDataSchema);

module.exports = userData;
