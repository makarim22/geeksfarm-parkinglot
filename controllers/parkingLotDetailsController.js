const parkingLots = [  
    // Bandung parking lots  
    {  
        id: 1,  
        name: 'Bandung City Center Parking Lot',  
        address: 'Jl. Merdeka No. 1, Bandung, West Java',  
        totalSpots: 50,  
        availableSpots: 20,  
        latitude: -6.917464,  
        longitude: 107.619123,  
        photo: '/images/p9.jpg',  
        openingTime: '06:00 AM',  
        closingTime: '10:00 PM',  
        motorcycle_tariff: 3000,  
        car_tariff: 9000, 
        rating: 4.2,  
        reviews: [  
            "Great location in the city center!",  
            "Spacious but can get crowded during events.",  
            "Friendly staff and good security."  
        ]  
    },  
    {  
        id: 2,  
        name: 'Bandung Airport Parking Garage',  
        address: 'Jl. Soekarno-Hatta No. 1, Bandung, West Java',  
        totalSpots: 100,  
        availableSpots: 50,  
        latitude: -6.903889,  
        longitude: 107.576389,  
        photo: '/images/p10.jpg',  
        openingTime: '24 Hours',  
        closingTime: 'N/A',  
        motorcycle_tariff: 3000,  
        car_tariff: 9000, 
        rating: 4.5,  
        reviews: [  
            "Convenient location for travelers.",  
            "Affordable rates and good service.",  
            "Always a spot available when I need it."  
        ]  
    },  
    {  
        id: 3,  
        name: 'Trans Studio Bandung Parking',  
        address: 'Jl. Gatot Subroto No. 289, Bandung, West Java',  
        totalSpots: 200,  
        availableSpots: 150,  
        latitude: -6.934444,  
        longitude: 107.610278,  
        photo: '/images/p11.jpg',  
        openingTime: '08:00 AM',  
        closingTime: '11:00 PM',  
        motorcycle_tariff: 3000,  
        car_tariff: 9000, 
        rating: 4.0,  
        reviews: [  
            "Best place to park when visiting the theme park.",  
            "Very close to the entrance.",  
            "Can be expensive during peak season."  
        ]  
    },  
    {  
        id: 4,  
        name: 'Universitas Padjadjaran Parking Lot',  
        address: 'Jl. Raya Bandung-Sumedang No. 1, Bandung, West Java',  
        totalSpots: 75,  
        availableSpots: 30,  
        latitude: -6.889444,  
        longitude: 107.610278,  
        photo: '/images/p13.jpg',  
        openingTime: '07:00 AM',  
        closingTime: '09:00 PM',  
        motorcycle_tariff: 3000,  
        car_tariff: 9000, 
        rating: 4.3,  
        reviews: [  
            "Easy access for students and faculty.",  
            "Good lighting and security.",  
            "Manage to find a spot most of the time."  
        ]  
    },  
    {  
        id: 5,  
        name: 'Cihampelas Walk Parking Lot',  
        address: 'Jl. Cihampelas No. 160, Bandung, West Java',  
        totalSpots: 150,  
        availableSpots: 100,  
        latitude: -6.895000,  
        longitude: 107.598611,  
        photo: '/images/p12.jpg',  
        openingTime: '09:00 AM',  
        closingTime: '10:00 PM',  
        motorcycle_tariff: 3000,  
        car_tariff: 9000, 
        rating: 4.6,  
        reviews: [  
            "Perfect spot for shopping nearby.",  
            "Secure and well-maintained.",  
            "Friendly atmosphere."  
        ]  
    },  
  
    // Jakarta parking lots  
    {  
        id: 6,  
        name: 'Parkir Senayan',  
        address: 'Jl. Jend. Sudirman No.1, Senayan, Jakarta',  
        latitude: -6.227,  
        longitude: 106.801,  
        photo: '/images/p14.jpg',  
        openingTime: '24 Hours',  
        closingTime: 'N/A',  
        motorcycleCapacity: 55,  
        carCapacity: 110,  
        motorcycleAvailableSpot: 25,  
        carAvailableSpot: 85,  
        motorcycle_tariff: 3000,  
        car_tariff: 9000,  
        rating: 4.7,  
        reviews: [  
            "Excellent for events at the stadium.",  
            "Secure and easily accessible.",  
            "Always available space."  
        ]  
    },  
    {  
        id: 7,  
        name: 'Parkir Thamrin',  
        address: 'Jl. M.H. Thamrin No.1, Jakarta',  
        latitude: -6.196,  
        longitude: 106.823,  
        photo: '/images/parking.jpg',  
        openingTime: '24 Hours',  
        closingTime: 'N/A',  
        motorcycleCapacity: 35,  
        carCapacity: 65,  
        motorcycleAvailableSpot: 15,  
        carAvailableSpot: 55,  
        motorcycle_tariff: 3200,  
        car_tariff: 10000,  
        rating: 4.2,  
        reviews: [  
            "Great location for shopping.",  
            "Feeling secure, lots of cameras.",  
            "Staff are really helpful."  
        ]  
    },  
    {  
        id: 8,  
        name: 'Parkir Kuningan',  
        address: 'Jl. Kuningan No.19, Jakarta',  
        latitude: -6.226,  
        longitude: 106.846,  
        photo: '/images/p15.jpg',  
        openingTime: '24 Hours',  
        closingTime: 'N/A',  
        motorcycleCapacity: 40,  
        carCapacity: 70,  
        motorcycleAvailableSpot: 15,  
        carAvailableSpot: 55,  
        motorcycle_tariff: 2500,  
        car_tariff: 9000,  
        rating: 4.1,  
        reviews: [  
            "Convenient for Kuningan area offices.",  
            "Cost-effective parking.",  
            "Can get congested in the afternoon."  
        ]  
    },  
    {  
        id: 9,  
        name: 'Parkir Sudirman',  
        address: 'Jl. Jend. Sudirman No.12, Jakarta',  
        latitude: -6.217,  
        longitude: 106.834,  
        photo: '/images/p7.jpg',  
        openingTime: '24 Hours',  
        closingTime: 'N/A',  
        motorcycleCapacity: 20,  
        carCapacity: 80,  
        motorcycleAvailableSpot: 5,  
        carAvailableSpot: 60,  
        motorcycle_tariff: 1500,  
        car_tariff: 7000,  
        rating: 4.5,  
        reviews: [  
            "Easy access to public transport.",  
            "Perfect for downtown meetings.",  
            "Reliable but limited spots."  
        ]  
    },  
    {  
        id: 10,  
        name: 'Parkir Glodok',  
        address: 'Jl. Glodok No.1, Jakarta',  
        latitude: -6.139,  
        longitude: 106.799,  
        photo: '/images/p6.jpg',  
        openingTime: '08:00 AM',  
        closingTime: '10:00 PM',  
        motorcycleCapacity: 25,  
        carCapacity: 40,  
        motorcycleAvailableSpot: 10,  
        carAvailableSpot: 30,  
        motorcycle_tariff: 2000,  
        car_tariff: 6000,  
        rating: 4.0,  
        reviews: [  
            "Close to shopping area.",  
            "Affordable rates, recently renovated.",  
            "Parking spots can be tight."  
        ]  
    },  
    {  
        id: 11,  
        name: 'Parkir Manggarai',  
        address: 'Jl. Manggarai No.4, Jakarta',  
        latitude: -6.203,  
        longitude: 106.849,  
        photo: '/images/p5.jpg',  
        openingTime: '24 Hours',  
        closingTime: 'N/A',  
        motorcycleCapacity: 45,  
        carCapacity: 90,  
        motorcycleAvailableSpot: 25,  
        carAvailableSpot: 70,  
        motorcycle_tariff: 2200,  
        car_tariff: 8500,  
        rating: 4.3,  
        reviews: [  
            "Ideal for Train connections.",  
            "Very clean and organized.",  
            "Small parking area but effective."  
        ]  
    },  
    {  
        id: 12,  
        name: 'Parkir Kemang',  
        address: 'Jl. Kemang Raya No.6, Jakarta',  
        latitude: -6.288,  
        longitude: 106.790,  
        photo: '/images/p4.jpg',  
        openingTime: '24 Hours',  
        closingTime: 'N/A',  
        motorcycleCapacity: 40,  
        carCapacity: 85,  
        motorcycleAvailableSpot: 30,  
        carAvailableSpot: 60,  
        motorcycle_tariff: 1800,  
        car_tariff: 7500,  
        rating: 4.4,  
        reviews: [  
            "Great for the Kemang nightlife.",  
            "Secure and well-lit.",  
            "Might need more staff during peak hours."  
        ]  
    },  
    {  
        id: 13,  
        name: 'Parkir Tebet',  
        address: 'Jl. Tebet Utara No.15, Jakarta',  
        latitude: -6.245,  
        longitude: 106.857,  
        photo: '/images/p3.jpg',  
        openingTime: '24 Hours',  
        closingTime: 'N/A',  
        motorcycleCapacity: 35,  
        carCapacity: 75,  
        motorcycleAvailableSpot: 35,  
        carAvailableSpot: 70,  
        motorcycle_tariff: 1200,  
        car_tariff: 5000,  
        rating: 4.2,  
        reviews: [  
            "Convenient for local businesses.",  
            "Affordable rates.",  
            "Good customer service."  
        ]  
    },  
    {  
        id: 14,  
        name: 'Parkir Plaza Senayan',  
        address: 'Jl. Asia Afrika No.8, Jakarta',  
        latitude: -6.21,  
        longitude: 106.798,  
        photo: '/images/p2.jpg',  
        openingTime: '24 Hours',  
        closingTime: 'N/A',  
        motorcycleCapacity: 40,  
        carCapacity: 120,  
        motorcycleAvailableSpot: 30,  
        carAvailableSpot: 75,  
        motorcycle_tariff: 2500,  
        car_tariff: 9500,  
        rating: 4.5,  
        reviews: [  
            "Perfect for shopping at Plaza Senayan.",  
            "Spacious and easy to navigate.",  
            "Some spots can be out of reach."  
        ]  
    },  
    {  
        id: 15,  
        name: 'Parkir Lippo Mall Puri',  
        address: 'Jl. Puri Agung No.1, Jakarta',  
        latitude: -6.202,  
        longitude: 106.726,  
        photo: '/images/parkinglot.jpg',  
        openingTime: '10:00 AM',  
        closingTime: '11:00 PM',  
        motorcycleCapacity: 50,  
        carCapacity: 130,  
        motorcycleAvailableSpot: 20,  
        carAvailableSpot: 90,  
        motorcycle_tariff: 3000,  
        car_tariff: 10000,  
        rating: 4.8,  
        reviews: [  
            "Best mall parking experience.",  
            "Clean and well-maintained.",  
            "Very accommodating staff."  
        ]  
    }  
]; 

const parkingLotDetailsController = {  
    getParkingLotDetails(req, res) {  
        const selectedParkingLotId = req.query.id; // Assume the ID is passed via query parameter  
        const parkingLotDetails = parkingLots.find(lot => lot.id === parseInt(selectedParkingLotId));  

        if (!parkingLotDetails) {  
            // If the parking lot isn't found, pass an error message  
            return res.status(404).render('errorPage', { message: 'Parking lot not found' });  
        }  

        // Render the view with parking lot details  
        res.render('user/parkinglot-details', { parkingLot: parkingLotDetails });  
    },  

    getAllParkingLots(req, res) {  
        // Render the view with all parking lots  
        res.render('user/parkinglot-details', { parkingLots });  
    }  
};  

module.exports = parkingLotDetailsController;
