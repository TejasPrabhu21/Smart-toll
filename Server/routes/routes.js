const express = require('express');
const cors = require('cors');
const gpsData = require('../models/gpsdata');
const vehicleDetails = require('../models/vehicleDetails');
const userData = require('../models/userData');
const router = express.Router();
router.use(cors());

router.get('/getcoords', (req, res, next) => {
    // gpsData.find().then((result) => {
    //     res.send(gpsData);
    // })
    const data = { cost: '100', entry_time: '10:50', exit_time: '11:00' };
    res.send(data);
});

router.post('/adduser', (req, res, next) => {
    const user = new userData({ "vname": "admin", "vpassword": "123" });
    user.save().then((result) => {
        res.status(201).send({ message: "success" });
    });
});

router.post('/login', async (req, res, next) => {
    const { vname, vpassword } = req.body;
    console.log(req.body);
    try {
        const user = await userData.findOne({ vname, vpassword });

        if (user) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Login failed. Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;