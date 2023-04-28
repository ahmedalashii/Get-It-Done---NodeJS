const mongoose = require('mongoose');
//! Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
const { ATLAS_DB_STRING } = process.env;

exports.connect = () => {
    // Connecting to the database
    mongoose
        .connect(ATLAS_DB_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};