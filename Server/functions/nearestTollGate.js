const axios = require('axios');

const TollGate = require('../models/tollGateData'); // Import the TollGate model

async function checkTollGate(vehicleCoordinates) {
    try {
        // Query the nearest toll gate using Mongoose
        const nearestTollGate = await TollGate.findOne({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: vehicleCoordinates
                    }
                }
            }
        }).exec();

        if (!nearestTollGate) { //If tollgate not found
            return { signal: 'No toll gate found nearby' };
        }

        // Use Google Maps Distance Matrix API to calculate distance
        // const apiKey = 'AIzaSyBD-mn-bJWNJyv2nWOg2JKvqFo4uPavfBw';
        // const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${vehicleCoordinates[1]},${vehicleCoordinates[0]}&destinations=${nearestTollGate.location.coordinates[1]},${nearestTollGate.location.coordinates[0]}&key=${apiKey}`;

        // const response = await axios.get(apiUrl);

        // if (response.status === 200 && response.data && response.data.rows && response.data.rows[0].elements) {
        //     const distanceInMeters = response.data.rows[0].elements[0].distance.value;
        //     const distanceInKilometers = distanceInMeters / 1000;

        //     // Check if the vehicle is within a certain distance from the toll gate
        //     const thresholdDistance = 0.1; // 100 meters in kilometers
        //     if (distanceInKilometers <= thresholdDistance) {
        //         return { signal: 'Vehicle crossed toll gate', tollGate: nearestTollGate };
        //     }
        // } else {
        //     console.error('Invalid response from Google Maps API:', response.status, response.statusText);
        // }


        // Vehicle is close to any toll gate
        return { signal: 'Nearest toll gate', tollGate: nearestTollGate };
    } catch (error) {
        console.error('Error occurred:', error);
        return { signal: 'Error occurred', error: error.message };
    }
}
module.exports = checkTollGate;


