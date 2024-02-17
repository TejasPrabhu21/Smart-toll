const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const gpsData = require('./models/gpsdata');
const tollGate = require('./models/tollGateData');
const mongoConnect = require('./functions/mongoConnect');
const checkTollGate = require('./functions/nearestTollGate');
require('dotenv').config();

const gpsRoutes = require('./routes/routes');

const app = express();
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// async function startApp() {
//     try {
//         const client = await mongoConnect();
//         // Your application logic goes here
//     } catch (error) {
//         console.error('Error starting the application:', error);
//         process.exit(1); // Exit the process with a non-zero exit code to indicate failure
//     }
// }
// startApp();


const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT;

const client = mongoose.connect(mongoURI)
    .then((result) => app.listen(PORT, () => {
        console.log('Connected to mongoDB.....Listening....');
    }))
    .catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send('hello');
});

app.get('/getdata', (req, res) => {
    gpsData.find().then((result) => {
        res.render('index', { title: 'IoT project', gpsData: result });
    }).catch((err) => { console.log(err); });
});

// app.get('/addgpsdata', (req, res) => {
//     // const data = JSON.parse('{"name":"John", "age":30, "city":"New York"}');
//     console.log(JSON.parse(req.body));
//     console.log(res.send(data));
//     // console.log(req.body);
// });

app.post('/addgpsdata', async (req, res) => {
    console.log(req.body);
    const { latitude, longitude } = req.body;
    // console.log(latitude, longitude, time);

    const newGPSData = new gpsData({ latitude, longitude });
    await newGPSData.save();

    res.status(201).send({ message: 'GPS data saved successfully' });
});


//Delete gps data from DB
app.get('/delete', async (req, res, next) => {
    try {
        const deletionCriteria = {
            latitude: { $lte: 100 }
        };

        const result = await gpsData.deleteMany(deletionCriteria);
        res.json({ deletedCount: result.deletedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Get entry exit points
app.get('/api/entryExitPoints', async (req, res) => {
    try {
        const entryExitPoints = {
            entryPoint: [12.906283, 74.859756],
            exitPoint: [54, 14]
        };
        res.status(200).json(entryExitPoints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching entry/exit points' });
    }
});

//Temporary route to add tollgates manually 
app.post('/addTollGateData', async (req, res) => {
    try {
        const tollData = {
            "name": "Kadri Park",
            "location": {
                "type": "Point",
                "coordinates": [12.886254, 74.862331] // Example coordinates (longitude, latitude)
            }
        }
        const newTollGate = new tollGate(tollData);
        await newTollGate.save();
        res.status(201).send({ message: "success new toll gate added." });
    } catch (error) {
        res.status(500).json({ message: 'Error adding new toll gate' });
    }
});

app.get('/nearestTollGate', async (req, res) => {
    try {
        console.log('Hello');
        const { signal, tollGate } = await checkTollGate([12.905507, 74.856255]);
        res.send({ signal, tollGate });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.use('/user', gpsRoutes);

