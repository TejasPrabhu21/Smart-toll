const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51OybtrSDmdojNxmcTPJu37sW6vgJlcOD4dZ6lbKMLZzI5xSjWi3ftjQMLGKvpPO0kQQKA7O3zSjq2j7is4An06tW000PPKkb28');


const payRouter = express.Router();
payRouter.use(cors());
require('dotenv').config();

// Endpoint to create a customer
payRouter.post('/createCustomer', async (req, res) => {
    try {
        const customer = await stripe.customers.create({
            name: req.name,
            // Add more customer detailss
        });
        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating customer');
    }
});

// // Endpoint to create a card for customer
// payRouter.post('/addCard', async (req, res) => {
//     try {
//         const {
//             customer_id,
//             card_name,
//             card_expYear,
//             card_expMonth,
//             card_number,
//             card_CVC
//         } = req.body;

//         const card_token = await stripe.tokens.create({
//             card: {
//                 name: card_name,
//                 number: card_number,
//                 exp_year: card_expYear,
//                 exp_month: card_expMonth,
//                 cvc: card_CVC
//             }
//         });

//         const card = await stripe.customers.createSource(customer_id, { source: `${card_token.id}` });
//         res.status(200).json({ card: card.id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error creating card token');
//     }
// });

payRouter.post('/addCard', async (req, res) => {
    try {
        const { customer_id } = req.body;

        if (!customer_id) {
            return res.status(400).send('Error: Missing customer ID');
        }

        const card = await stripe.customers.createSource(customer_id, { source: 'tok_visa' });
        res.status(200).json({ card: card.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating card token');
    }
});


// Endpoint to add funds to wallet
// payRouter.post('/addFunds', async (req, res) => {
//     try {
//         const charge = await stripe.charges.create({
//             amount: req.body.amount * 100, // Amount in cents
//             currency: 'INR',
//             card: req.body.card_id,
//             customer: req.body.customer_id, // Customer ID from your database
//             description: 'Adding funds to wallet',
//         });
//         // Update wallet balance in your database
//         res.status(200).json(charge);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error adding funds');
//     }
// });
payRouter.post('/addFunds', async (req, res) => {
    try {
        const { customer_id, amount, payment_method } = req.body;

        if (!customer_id || !amount || !payment_method) {
            return res.status(400).send('Error: Missing required data');
        }


        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Amount in cents
            currency: 'inr',
            customer: customer_id,
            description: 'Adding funds to wallet',
            payment_method: payment_method
        });

        res.status(200).json({ paymentIntent }); // Send the PaymentIntent client secret to client-side to confirm
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding funds');
    }
});


// Endpoint to deduct funds for toll
payRouter.post('/deductFunds', async (req, res) => {
    try {
        // Deduct amount from customer's wallet balance in our database(not implemented)
        res.status(200).send('Funds deducted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deducting funds');
    }
});

module.exports = payRouter;