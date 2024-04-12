const calculateDistance = require('./distance.js');

async function calculateTollTax(vehicleType, distance) {
    //Toll tax rates based on vehicle type
    const tollTaxRates = {
        'car': 0.9,
        'motorcycle': 1,
        'mini-bus': 3,
        'large-bus': 5,
        'truck': 5,
        'multi-axle-truck': 10,
    };

    // Validate vehicle type
    if (!(vehicleType in tollTaxRates)) {
        throw new Error('Invalid vehicle type');
    }

    try {
        // Call the calculateDistance function to determine the distance traveled
        // const distance = await (calculateDistance(coordinates));

        // Calculate toll tax based on vehicle type and distance traveled
        const tollTax = (distance) * tollTaxRates[vehicleType];
        // console.log(distance);
        // console.log(tollTax);
        return tollTax.toPrecision(2) * 100;
    } catch (error) {
        console.error('Error occurred while calculating toll tax:', error);
        throw new Error('Failed to calculate toll tax');
    }
}

module.exports = calculateTollTax;
