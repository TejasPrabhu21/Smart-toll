const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    }
});
const userData = mongoose.model("userData", userDataSchema);

module.exports = userData;