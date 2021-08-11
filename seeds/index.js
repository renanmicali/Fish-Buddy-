const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');
const FishSpot = require('../models/fishspot.js');

mongoose.connect('mongodb://localhost:27017/fish-buddy', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await FishSpot.deleteMany({});
    for (let i = 0; i < 350; i++) {
        const random = Math.floor(Math.random() * 543);
        const fish = new FishSpot({
            //my user id
            author: '610f8a04b4b011319096bffb',
            location: `${cities[random].city}, ${cities[random].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam cumque similique fugit ipsam consectetur quidem reiciendis corrupti facilis aspernatur, nisi mollitia possimus quasi impedit tempore numquam adipisci, voluptate voluptatum maiores!',
            geometry: {
                coordinates: [
                    cities[random].lng,
                    cities[random].lat,
                ],
                type: 'Point'
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/du29yspmy/image/upload/v1628495974/FishBuddyYelp/uhgcfsrqwceitojds3xa.jpg',
                    filename: 'FishBuddyYelp/uhgcfsrqwceitojds3xa'
                },
                {
                    url: 'https://res.cloudinary.com/du29yspmy/image/upload/v1628495978/FishBuddyYelp/zzfhwgwjfpq2us1h8u73.jpg',
                    filename: 'FishBuddyYelp/zzfhwgwjfpq2us1h8u73'
                }

            ]
        })
        await fish.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})