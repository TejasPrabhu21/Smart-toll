const express = require('express');
const vehicleRouter = express.Router();
const jwt = require('jsonwebtoken');
const calculateDistance = require('../functions/distance.js');
const calculateTollTax = require('../functions/amount.js');
const TransactionLogs = require('../models/transactionLogs');
const userData = require('../models/userData');
const transactionLogs = require('../models/transactionLogs');
const axios = require('axios');
const vehicleDetails = require('../models/vehicleDetails.js');
const checkTollGate = require('../functions/nearestTollGate.js');

const IST_TIMEZONE_OFFSET = 5.5 * 60 * 60 * 1000;

//to get the nearest toll gate to current location
vehicleRouter.get('/nearestTollGate', async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        // const { signal, tollGate } = await checkTollGate([latitude, longitude]);
        // res.send({ signal, tollGate });

        res.status(201).json({
            checkPoints: [
                [12.8949606, 74.8454148],
                [12.894651777327926, 74.84534188136371],
                [12.894394304346331, 74.8451676958684]
            ]
        });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for handling entry events from the OBU
vehicleRouter.post('/entry', async (req, res) => {
    try {
        const { vehicleNumber, coordinates } = req.body;
        const entryTime = new Date(Date.now() + IST_TIMEZONE_OFFSET);
        let userId;
        let user = await userData.findOne({ vehicleNumber });

        if (!user) {
            const { RegistrationNumber, OwnerName, PhoneNumber } = await vehicleDetails.findOne({ RegistrationNumber: vehicleNumber });

            user = new userData({ vehicleNumber: RegistrationNumber, username: OwnerName, phoneNumber: PhoneNumber });
            await user.save();
        }
        userId = user._id;

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
        const token = jwt.sign({ coordinates, transactionId: transaction._id, userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(`Vehicle ${vehicleNumber} entered. Coordinates: ${coordinates}\n`);

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
        const user = userData.findById(userId);

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
                    'customerId': "cus_id_42j3b4k2b3342b3"
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction log not found' });
        }

        const updatedUserData = await userData.findOneAndUpdate(
            { vehicleNumber: vehicleNumber },
            {
                $push: { transactionLogs: updatedTransaction._id },
                $inc: { balance: -tollAmount }
            }, // Push transaction log ID to the array and deduct toll amount
            { new: true } // Return updated document
        );

        if (!updatedUserData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        console.log(`Vehicle ${vehicleNumber} exited. Coordinates: ${coordinates} \n Distance travelled: ${distance} km \n Toll Amount: ₹ ${tollAmount} \n\n`);

        res.status(200).json({ updatedTransaction, 'distance': distance, 'tollAmount': tollAmount, message: 'Exit recorded successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = vehicleRouter;
