const express = require('express');
const cors = require('cors');

const payRouter = express.Router();
payRouter.use(cors());
require('dotenv').config();


// Endpoint to create a customer
payRouter.post('/createCustomer', async (req, res) => {
    try {
        const customer = await stripe.customers.create({
            email: "newCustomer@smart.com", // Assuming email is sent from the client
            // Add more customer details as needed
        });
        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating customer');
    }
});

// Endpoint to add funds to wallet
payRouter.post('/addFunds', async (req, res) => {
    try {
        const charge = await stripe.charges.create({
            amount: req.body.amount, // Amount in cents
            currency: 'inr',
            customer: req.body.customerId, // Customer ID from your database
            description: 'Adding funds to wallet',
        });
        // Update wallet balance in your database
        res.status(200).json(charge);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding funds');
    }
});

// Endpoint to deduct funds for toll
payRouter.post('/deductFunds', async (req, res) => {
    try {
        // Deduct funds from customer's wallet balance in your database
        // You may also want to create a charge object here for accounting purposes
        res.status(200).send('Funds deducted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deducting funds');
    }
});


module.exports = payRouter;