const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user.controller");
const auth = require('../middlewares/auth');
// Register a new User
router.post("/register", UserController.register);

// Login a registered User
router.post("/login", UserController.login);

//! Note that we can use a rate limiter to limit the number of requests to the login route, to prevent brute force attacks. >> but for now it's just a simple app, so we don't need to do that.

// Logout a registered User (Delete the token) >> We can use redis to store the token and check if it's valid or not :)
// router.post("/logout", auth, UserController.logout);

// But we don't need to logout, because we are using JWT, so we can just delete the token from the client side and the user will be logged out automatically.


module.exports = router;