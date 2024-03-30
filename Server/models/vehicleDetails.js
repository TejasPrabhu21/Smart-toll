const mongoose = require('mongoose');

const vehicleDetailsSchema = new mongoose.Schema({
    RegistrationNumber: {
        type: String,
        required: true
    },
    RegistrationDate: {
        type: Date,
        required: true
    },
    ChasisNumber: {
        type: String,
        required: true
    },
    EngineNumber: {
        type: String,
        required: true
    },
    OwnerName: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: String,
        required: true
    }
});
const vehicleDetails = mongoose.model("vehicleDetails", vehicleDetailsSchema);

module.exports = vehicleDetails;