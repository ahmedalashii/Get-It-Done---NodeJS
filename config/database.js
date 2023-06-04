const mongoose = require('mongoose');
//! Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
//! mongoose is built on top of the mongodb native driver to provide programmers with a way to model their data.
const { ATLAS_DB_STRING } = process.env;

/*
    ? mongodb vs mongoose (Pros & Cons):

    Using mongoose, a user can define the schema for the documents in a particular collection. It provides a lot of convenience in the creation and management of data in MongoDB. On the downside, learning mongoose can take some time, and has some limitations in handling schemas that are quite complex.

    However, if your collection schema is unpredictable, or you want a Mongo-shell like experience inside Node.js, then go ahead and use the mongodb driver. It is the simplest to pick up. The downside here is that you will have to write larger amounts of code for validating the data, and the risk of errors is higher.

    ---------- 

    If you don't want to use any ORM for your data models then you can also use native driver mongo.js: https://github.com/mongodb/node-mongodb-native.

    Mongoose is one of the orm's who give us functionality to access the mongo data with easily understandable queries.

    Mongoose plays as a role of abstraction over your database model.

*/


exports.connect = () => { // its' like const connect = () => { ... } and then module.exports = connect;
    // Connecting to the database
    mongoose.connect(ATLAS_DB_STRING, {
        useNewUrlParser: true, // useNewUrlParser: true is used because of the new url string parser in the new MongoDB driver (ensures compatibility with future MongoDB versions)
        useUnifiedTopology: true, // useUnifiedTopology: true is used because of the new server discovery and monitoring engine in the new MongoDB driver
    }).then(() => {
        console.log("Successfully connected to database");
    }).catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });
};