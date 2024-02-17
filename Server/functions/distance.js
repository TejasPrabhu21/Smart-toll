// Load the Google Maps API
function initMap() {
    // You may need to replace 'YOUR_API_KEY' with your own Google Maps API key
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBD-mn-bJWNJyv2nWOg2JKvqFo4uPavfBw&callback=calculateDistance';
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
}

// Function to calculate distance between two points
function calculateDistance() {
    var point1 = new google.maps.LatLng(latitude1, longitude1); // Latitude and Longitude of Point 1
    var point2 = new google.maps.LatLng(latitude2, longitude2); // Latitude and Longitude of Point 2

    // Calculate the distance between the two points
    var distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);

    // Convert distance to kilometers (distance is in meters by default)
    var distanceInKm = distance / 1000;

    console.log("Distance between the two points is: " + distanceInKm + " kilometers");
}

// Example usage:
var latitude1 = 40.7128; // Latitude of Point 1 (e.g., New York)
var longitude1 = -74.0060; // Longitude of Point 1 (e.g., New York)
var latitude2 = 34.0522; // Latitude of Point 2 (e.g., Los Angeles)
var longitude2 = -118.2437; // Longitude of Point 2 (e.g., Los Angeles)

// Initialize the map and calculate the distance
initMap();
