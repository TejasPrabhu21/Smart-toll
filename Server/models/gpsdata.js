const mongoose = require("mongoose");

const gpsdataSchema = new mongoose.Schema({
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: Date.now(),
        required: true
    }
    // updatedate: {
    //     type: Date,
    //     default: Date.now(),
    //     required: false
    // }
});

const gpsdata = mongoose.model("gpsdata", gpsdataSchema);

module.exports = gpsdata;