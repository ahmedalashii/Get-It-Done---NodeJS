const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user.controller");
const auth = require('../middleware/auth');
// Register a new User
router.post("/register", UserController.register);

// Login a registered User
router.post("/login", UserController.login);

// Logout a registered User
router.post("/logout", auth, UserController.logout);

module.exports = router;