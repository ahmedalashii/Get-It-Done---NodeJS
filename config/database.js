const mongoose = require('mongoose');
//! Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
//! mongoose is built on top of the mongodb native driver to provide programmers with a way to model their data.
const { ATLAS_DB_STRING } = process.env;

/*
    mongodb vs mongoose (pros and cons):

    Using mongoose, a user can define the schema for the documents in a particular collection. It provides a lot of convenience in the creation and management of data in MongoDB. On the downside, learning mongoose can take some time, and has some limitations in handling schemas that are quite complex.

    However, if your collection schema is unpredictable, or you want a Mongo-shell like experience inside Node.js, then go ahead and use the mongodb driver. It is the simplest to pick up. The downside here is that you will have to write larger amounts of code for validating the data, and the risk of errors is higher.
*/


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