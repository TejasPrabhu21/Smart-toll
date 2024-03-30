const mongoose = require("mongoose");

const travelLogSchema = new mongoose.Schema({
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        default: Date.now(),
        required: true
    }
});

const travelLog = mongoose.model("travelLog", travelLogSchema);

module.exports = travelLog;