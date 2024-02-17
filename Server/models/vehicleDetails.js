const mongoose = require('mongoose');

const vehicleDetailsSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
});
const vehicleDetails = mongoose.model("vehicleDetails", vehicleDetailsSchema);

module.exports = vehicleDetails;