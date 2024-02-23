const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    vname: {
        type: String,
        required: true
    },
    vpassword: {
        type: String,
        required: true
    }
});
const userData = mongoose.model("userData", userDataSchema);

module.exports = userData;