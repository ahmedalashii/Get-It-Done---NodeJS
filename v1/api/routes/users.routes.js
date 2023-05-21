const express = require('express');
const router = express.Router();
const UserController = require("../../../controllers/user.controller");
const auth = require('../../../middlewares/auth');

//^ The pattern below is called "Chaining Routes" or "Route Grouping" or "Builder Design Pattern"
// Register a new User
router
    .post("/register", UserController.apiRegister) // localhost:3000/api/v1/users/register
    // Login a registered User
    .post("/login", UserController.apiLogin);

//! Note that we can use a rate limiter (throttling) to limit the number of requests to the login route, to prevent brute force attacks. >> but for now it's just a simple app, so we don't need to do that.

//^ Logout a registered User (Delete the token) >> We can use redis (node-redis >> an in-app memory storage for the server) to store the token and check if it's valid or not :)
//^ router.post("/logout", auth, UserController.apiLogout);

// But we don't need to logout, because we are using JWT, so we can just delete the token from the client side and the user will be logged out automatically. (Just a simple app, so we don't need to do that)

module.exports = router;