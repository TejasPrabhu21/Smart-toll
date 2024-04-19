const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const tollGate = require('./models/tollGateData');

const mongoConnect = require('./functions/mongoConnect');
const checkTollGate = require('./functions/nearestTollGate');
const calculateDistance = require('./functions/distance.js');
require('dotenv').config();

const gpsRoutes = require('./routes/routes');
const vehicleRouter = require('./routes/travelRoutes.routes.js');

const app = express();
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//If a seperate connection file is used....
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

//variables that access .env variables
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT;

const client = mongoose.connect(mongoURI)  //connect to mongodb
    .then((result) => app.listen(PORT, () => {
        console.log('Connected to mongoDB.....Listening....');
    }))
    .catch((err) => console.log(err));


//default route
app.get('/', (req, res) => {
    res.send('hello');
});

app.get('/getdata', (req, res) => {
    gpsData.find().then((result) => {
        res.render('index', { title: 'IoT project', gpsData: result });
    }).catch((err) => { console.log(err); });
});

app.get('/addgpsdata', (req, res) => {
    const data = JSON.parse('{"name":"John", "age":30, "city":"New York"}');
    // console.log(JSON.parse(req.body));
    console.log(res.send(data));
    // console.log(req.body);
});

app.post('/addgpsdata', async (req, res) => {
    try {
        console.log(req.body);
        const { latitude, longitude } = req.body;
        // console.log(latitude, longitude, time);

        const newGPSData = new gpsData({ latitude, longitude });
        await newGPSData.save();

        res.status(201).send({ message: 'GPS data saved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Delete gps data from DB
app.get('/delete', async (req, res, next) => {
    try {
        const deletionCriteria = {
            time: { $lt: "1708361741218" }
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
            entryPoint: [12, 74],
            exitPoint: [50, 10]
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
            "name": "Canara Bus Stop",
            "location": {
                "type": "Point",
                "coordinates": [12.898323, 74.986961] // Example coordinates (longitude, latitude)
            }
        }
        const newTollGate = new tollGate(tollData);
        await newTollGate.save();
        res.status(201).send({ message: "success new toll gate added." });
    } catch (error) {
        res.status(500).json({ message: 'Error adding new toll gate' });
    }
});


// //to get the nearest toll gate to current location
// app.get('/nearestTollGate', async (req, res) => {
//     try {
//         const { latitude, longitude } = req.query;
//         const { signal, tollGate } = await checkTollGate([latitude, longitude]);
//         res.send({ signal, tollGate });
//     } catch (error) {
//         console.error('Error occurred:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

//get distance between two points
app.get('/distance', async (req, res) => {

    // const coordinates = { origin: [40.7128, -74.0060], destination: [34.0522, -118.2437] };
    const coordinates = req.body;

    try {
        const distance = await calculateDistance(coordinates);
        res.json({ distance });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/entryexitstatus', (req, res) => {
    try {
        const { latitude, longitude, status } = req.body;

        if (status === "success") {
            const newTravelLog = new travelLog({ latitude, longitude, status });
            newTravelLog.save();
            res.status(201).send({ message: 'Travel log saved successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
//User requests are forwarded to this router /user
app.use('/user', gpsRoutes);
app.use('/vehicle', vehicleRouter);

