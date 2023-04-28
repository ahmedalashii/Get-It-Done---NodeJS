const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user.controller");
const auth = require('../middleware/auth');
// Register a new User
router.post("/register", UserController.register);

// Login a registered User
router.post("/login", UserController.login);

// Logout a registered User (Delete the token) >> We can use redis to store the token and check if it's valid or not :)
// router.post("/logout", auth, UserController.logout);

// But we don't need to logout, because we are using JWT, so we can just delete the token from the client side and the user will be logged out automatically.


module.exports = router;