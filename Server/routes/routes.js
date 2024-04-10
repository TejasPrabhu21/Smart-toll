const express = require('express');
const cors = require('cors');
const randomize = require('randomatic'); // for generating random OTPs
const twilio = require('twilio'); // if using Twilio for SMS
const fast2sms = require('fast-two-sms');
const axios = require('axios');
const OTP = require('../models/otp');
const paymentRoutes = require('./paymentRoutes.routes');

// const nodemailer = require('nodemailer'); // if using nodemailer for email
// const { validatePhoneNumber, validateEmail } = require('./validation');

//Database models
const vehicleDetails = require('../models/vehicleDetails');
const userData = require('../models/userData');
const transactionLogs = require('../models/transactionLogs');


const router = express.Router();
router.use(cors());
require('dotenv').config();


router.post('/adduser', (req, res, next) => {
    const user = new userData({ "username": "user", "vehicleNumber": "KA-19-MH-2002" });
    user.save().then((result) => {
        res.status(201).send({ message: "success" });
    });
});

router.post('/login', async (req, res, next) => {
    const { username, vehicleNumber } = req.body;
    console.log(req.body);
    try {
        const user = await userData.findOne({ username, vehicleNumber });

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


//Get vehicle owners details API
router.post('/vehicle', async (req, res) => {
    try {
        const { registrationNumber } = req.body;
        const vehicle = await vehicleDetails.findOne({ RegistrationNumber: registrationNumber });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Send the response from VAHAN API to the client
        res.status(200).json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        res.status(500).json({ error: 'Failed to fetch vehicle details' });
    }
});

//send and OTP
router.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    //otp is saved to db
    try {
        await OTP.create({ phoneNumber, otp });
    } catch (error) {
        console.error('Error saving OTP to database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    // Send OTP via fast-two-sms
    // try {

    //     const response = await axios.post(
    //         process.env.FAST_TWO_SMS_URI,
    //         {
    //             route: 'q',
    //             message: `Your SMART TOLL app OTP is ${otp}. Valid till 5 minutes.`,
    //             language: 'english',
    //             flash: 0,
    //             numbers: phoneNumber,
    //         },
    //         {
    //             headers: {
    //                 "authorization": process.env.FAST_TWO_SMS_API_KEY,
    //                 "Content-Type": "application/json",
    //                 'Cache-Control': 'no-cache',
    //             },
    //         }
    //     );
    //     if (response.data.return === true) {
    //         res.send('OTP sent successfully');
    //     } else {
    //         res.send('Failed to send OTP');
    //     }
    // } catch (error) {
    //     console.log(error); 
    //     res.send('Error sending OTP');
    // }
    res.send('OTP sent successfully');
});

// Route to handle OTP verification
router.post('/verify-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    try {
        // Look for the OTP entry
        const otpEntry = await OTP.findOne({ phoneNumber, otp });

        if (!otpEntry) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Check if OTP has expired
        if (otpEntry.expiresAt < new Date()) {
            return res.status(400).json({ error: 'OTP has expired' });
        }

        // If OTP is valid, delete it from the database
        await OTP.deleteOne({ _id: otpEntry._id });

        // // Format phone number properly
        // const formattedPhoneNumber = "+91" + phoneNumber;

        // // Call external service to fetch vehicle registration details
        // const vehicleData = { "PhoneNumber": formattedPhoneNumber };
        // const { data } = await axios.post('https://smart-toll.onrender.com/user/vehicle', vehicleData);

        // const { RegistrationNumber, OwnerName, PhoneNumber } = data;

        // // Check if user data already exists
        // let existingUser = await userData.findOne({ vehicleNumber: RegistrationNumber });

        // if (!existingUser) {
        //     // If user data doesn't exist, create a new entry
        //     const newUser = new userData({ username: OwnerName, vehicleNumber: RegistrationNumber, phoneNumber: PhoneNumber });
        //     await newUser.save();
        // }

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/getBalance', async (req, res) => {
    const { vehicleNumber, customerId, amount } = req.body;
    try {
        const updatedUser = await userData.findOneAndUpdate(
            { vehicleNumber },
            { customerId: customerId, $inc: { balance: amount }, verified: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ balance: updatedUser.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/getTransactionLogs', async (req, res) => {
    const { vehicleNumber } = req.body;
    try {
        const user = await userData.findOne({ vehicleNumber: vehicleNumber }).populate({ path: 'transactionLogs', model: 'transactionLogs' });

        res.status(200).send({ transactions: user.transactionLogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.use('/payment', paymentRoutes);

module.exports = router;












// router.post('/send-otp', (req, res) => {
//     const phoneNumber = '+91' + req.query.phoneNumber; // Assuming phone number is provided as a query parameter
//     if (!phoneNumber) {
//         return res.status(400).send('Phone number is required');
//     }

//     // Twilio variables
//     const accountSid = 'ACfa0b4fb8544abb729fa7320f320d4c19';
//     const authToken = 'c7f538d9036c5e77aa57c44ad58d63fc';
//     const client = new twilio(accountSid, authToken);

//     const otp = Math.floor(100000 + Math.random() * 900000);


//     client.verify.services('VAbbe0ba231d37cd19055cc72406f066cd')
//         .verifications
//         .create({ to: phoneNumber, channel: 'sms' })
//         .then(verification => console.log(`OTP sent to ${phoneNumber}: ${verification.sid}`))
//         .catch(error => console.error(`Failed to send OTP: ${error}`));

//     res.send('OTP sent successfully');
// });

// router.get('/verifyOTP', (req, res) => {
//     const phoneNumber = '+91' + req.query.phoneNumber;
//     const userEnteredCode = req.query.code;

//     if (!phoneNumber || !userEnteredCode) {
//         return res.status(400).send('Phone number and code are required');
//     }
//     const accountSid = 'ACfa0b4fb8544abb729fa7320f320d4c19';
//     const authToken = 'c7f538d9036c5e77aa57c44ad58d63fc';
//     const client = new twilio(accountSid, authToken);
//     client.verify.services('VAbbe0ba231d37cd19055cc72406f066cd')
//         .verificationChecks
//         .create({ to: phoneNumber, code: userEnteredCode })
//         .then(verificationCheck => {
//             if (verificationCheck.status === 'approved') {
//                 res.send('OTP verified successfully');
//             } else {
//                 res.status(400).send('OTP verification failed');
//             }
//         })
//         .catch(error => res.status(500).send(`Failed to verify OTP: ${error}`));
// });