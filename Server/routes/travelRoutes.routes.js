const express = require('express');
const vehicleRouter = express.Router();
const jwt = require('jsonwebtoken');
const calculateDistance = require('../functions/distance.js');
const calculateTollTax = require('../functions/amount.js');
const TransactionLogs = require('../models/transactionLogs');
const userData = require('../models/userData');
const transactionLogs = require('../models/transactionLogs');

const IST_TIMEZONE_OFFSET = 5.5 * 60 * 60 * 1000;


// Route for handling entry events from the OBU
vehicleRouter.post('/entry', async (req, res) => {
    try {
        const { vehicleNumber, coordinates } = req.body;
        const entryTime = new Date(Date.now() + IST_TIMEZONE_OFFSET);

        const user = await userData.findOne({ vehicleNumber });
        // Create transaction log document
        const transaction = new transactionLogs({
            entry: {
                location: {
                    type: 'Point',
                    coordinates: coordinates
                },
                time: entryTime
            },
            exit: {
                location: {
                    type: 'Point',
                    coordinates: [0, 0]
                }
            },
            vehicleNumber
        });
        await transaction.save();

        // Generate JWT token with entryCoordinates
        const token = jwt.sign({ coordinates, transactionId: transaction._id, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, transaction });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for handling exit events from the OBU
vehicleRouter.post('/exit', async (req, res) => {
    try {
        const { vehicleNumber, coordinates, token } = req.body;

        // Verify and decode JWT token to get entryCoordinates
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const entryCoordinates = decoded.coordinates;
        const transactionId = decoded.transactionId;
        const userId = decoded.userId;
        console.log(userId);
        const entryExitCoords = { origin: entryCoordinates, destination: coordinates }

        const distance = await calculateDistance(entryExitCoords);
        const tollAmount = await calculateTollTax('car', distance);
        const exitTime = new Date(Date.now() + IST_TIMEZONE_OFFSET);

        // Update the transaction log document with exit details
        const updatedTransaction = await transactionLogs.findByIdAndUpdate(
            transactionId,
            {
                $set: {
                    'exit.location': {
                        type: 'Point',
                        coordinates: coordinates
                    },
                    'exit.time': exitTime,
                    'tollPaid': tollAmount,
                    'customerId': 'cid_si234209jsdf'
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction log not found' });
        }

        const updatedUserData = await userData.findOneAndUpdate(
            { vehicleNumber: vehicleNumber },
            { $push: { transactionLogs: updatedTransaction._id } }, // Push transaction log ID to the array
            { new: true } // Return updated document
        );
        console.log(updatedUserData);
        res.status(200).json({ updatedTransaction, 'distance': distance, 'tollAmount': tollAmount, message: 'Exit recorded successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = vehicleRouter;
