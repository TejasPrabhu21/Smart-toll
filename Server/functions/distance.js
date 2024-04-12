const axios = require('axios');

// coordinates = { origin: [40.7128, -74.0060], destination: [34.0522, -118.2437] }
async function calculateDistance(coordinates){
    try{ 
        const origin = coordinates.origin.reverse().join(',');
        const destination = coordinates.destination.reverse().join(',');

        // Calculate distance
        const distanceResponse = await axios.get(`https://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=false`);
        const distance = distanceResponse.data.routes[0].distance; // Distance is in meters
        // console.log("Distance:", distance / 1000, "km"); // Convert distance to kilometers
        return (distance / 1000).toPrecision(3);
    } catch(error){
        console.log(error);
    }
}
module.exports = calculateDistance;



// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// import axios from "axios";

// async function calculateDistance(){
//     try{
//         // const originQuery = 'New York City'; 
//         // const destinationQuery = 'Los Angeles';
//         const origin = "74.857351,12.905115"; 
//         const destination = "74.846173,12.899358";

//         // // Get coordinates for origin
//         // const originResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${originQuery}`);
//         // const originLat = originResponse.data[0].lat;
//         // const originLon = originResponse.data[0].lon;
//         // console.log(originResponse.data[0]);
//         // console.log("Origin coordinates:", originLat, originLon);
//         // const origin = `${originLon},${originLat}`; // Corrected order

//         // // Get coordinates for destination
//         // const destinationResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${destinationQuery}`);
//         // console.log(destinationResponse.data[0]);
//         // const destinationLat = destinationResponse.data[0].lat;
//         // const destinationLon = destinationResponse.data[0].lon;
//         // console.log("Destination coordinates:", destinationLat, destinationLon);
//         // const destination = `${destinationLon},${destinationLat}`; // Corrected order

//         // Calculate distance
//         const distanceResponse = await axios.get(`https://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=false`);
//         const distance = distanceResponse.data.routes[0].distance; // Distance is in meters
//         console.log("Distance:", distance / 1000, "km"); // Convert distance to kilometers
//     } catch(error){
//         console.log(error);
//     }
// }

// calculateDistance();



// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// import axios from "axios";

// async function calculateDistance(){
//     try{
//         const apiKey = "AIzaSyBD-mn-bJWNJyv2nWOg2JKvqFo4uPavfBw";
//         const origin = '40.7128,-74.0060'; 
//         const destination = '34.0522,-118.2437';
//         const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${apiKey}` 
//         const response = await axios.get(apiUrl);
//         console.log(response.data);
//         console.log(response.data.rows[0].elements);
//     }catch(error){
//         console.log(error);
//     }
// }

// calculateDistance();


// ----------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------

// import { Client } from '@googlemaps/google-maps-services-js';

// // Create a new instance of the Google Maps Services client
// const client = new Client({});

// // Function to calculate distance between two points using the Directions API
// async function calculateDistance(origin, destination) {
//     try {
//         // Send a request to the Directions API to get the distance
//         const response = await client.directions({
//             params: {
//                 origin: origin,
//                 destination: destination,
//                 mode: 'driving', // You can change the travel mode if needed
//             },
//         });

//         // Extract the distance from the response
//         const distance = response.data.routes[0].legs[0].distance.value; // Distance in meters
//         const distanceInKm = distance / 1000; // Convert meters to kilometers

//         return distanceInKm;
//     } catch (error) {
//         console.error('Error calculating distance:', error.message);
//         throw error;
//     }
// }

// // Example usage:
// const origin = '40.7128,-74.0060'; // Latitude and longitude of Point 1 (e.g., New York)
// const destination = '34.0522,-118.2437'; // Latitude and longitude of Point 2 (e.g., Los Angeles)

// calculateDistance(origin, destination)
//     .then(distance => {
//         console.log('Distance between the two points:', distance, 'kilometers');
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });




// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------
// const axios = require('axios');

// // Example usage:
// var latitude1 = 40.7128; // Latitude of Point 1 (e.g., New York)
// var longitude1 = -74.0060; // Longitude of Point 1 (e.g., New York)
// var latitude2 = 34.0522; // Latitude of Point 2 (e.g., Los Angeles)
// var longitude2 = -118.2437; // Longitude of Point 2 (e.g., Los Angeles)


// // Load the Google Maps API
// function loadGoogleMapsAPI(apiKey) {
//     const apiUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
//     return axios.get(apiUrl);
// }

// // Function to calculate distance between two points
// function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
//     var point1 = new google.maps.LatLng(latitude1, longitude1); // Latitude and Longitude of Point 1
//     var point2 = new google.maps.LatLng(latitude2, longitude2); // Latitude and Longitude of Point 2

//     // Calculate the distance between the two points
//     var distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);

//     // Convert distance to kilometers (distance is in meters by default)
//     var distanceInKm = distance / 1000;

//     console.log("Distance between the two points is: " + distanceInKm + " kilometers");
// }

// loadGoogleMapsAPI('AIzaSyBD-mn-bJWNJyv2nWOg2JKvqFo4uPavfBw')
//     .then(() => {
//         calculateDistance(latitude1, longitude1, latitude2, longitude2);
//     })
//     .catch(error => {
//         console.error('Error loading Google Maps API:', error);
//     });





// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// async function calculateDistance(point1, point2) {
    //     const apiKey = 'AlvvPNaXlclFfBIcnFLo-qLnrvacYVQF1FOQbr8bpQRlD0SFxjN38J0zzJ5_Smrm'; // Replace with your own API key
    //     const apiUrl = `http://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?key=${apiKey}&origins=${point1}&destinations=${point2}`;
    //     console.log('Success');
    //     try {
    //         const response = await axios.get(apiUrl);
    //         const distance = response.data.resourceSets[0].resources[0].results[0].travelDistance;
    //         return distance;
    //     } catch (error) {
    //         console.error('Error calculating distance:', error);
    //         throw error;
    //     }
    // }
    
    // module.exports = calculateDistance;