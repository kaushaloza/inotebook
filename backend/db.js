// Database connectivity over here

const mongoose = require("mongoose");

const mongoURL = "mongodb://localhost:27017/notebook";


const connectToMongo = () => {
    mongoose.connect(mongoURL, () => {
        console.log("Connected to mongo!")
    })
}

module.exports = connectToMongo;

