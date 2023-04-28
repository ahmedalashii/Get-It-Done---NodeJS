const User = require('../models/User');
const bcrypt = require('bcryptjs');
require("dotenv").config();
const jwt = require('jsonwebtoken');

const userService = class UserService {
    static async register(data) {
        /*
            1- Validate if the user already exists.
            2- Encrypt the user password.
            3- Create a user in our database.
            4- And finally, create a signed JWT token.
        */
        try {
            const { first_name, last_name, email, password } = data;
            const oldUser = await User.findOne({ email });
            if (oldUser) {
                return { error: "User Already Exists. Please Login" };
            }
            // Encrypting Password
            const encryptedPassword = await bcrypt.hash(password, 10); // 10 is SALT (random string added to the password before hashing)
            // Create a new user
            const user = await User.create({
                first_name: first_name,
                last_name: last_name,
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
            });
            // Create a token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.JWT_TOKEN_KEY,
            );
            // save user token
            user.token = token;
            // return new user
            return user;
        } catch (error) {
            console.log("Couldn't Create a New User", error);
        }
    }

    static async login(data) {
        /*
            1- Validate if the user already exists.
            2- Verify user password against the encrypted password in the database.
            3- And finally, create a signed JWT token.
        */
        try {
            const { email, password } = data;
            const user = await User.findOne({ email });
            if (!user) {
                return { error: "User Doesn't Exist. Please Register" };
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return { error: "Invalid Credentials" };
            }
            // Create a token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.JWT_TOKEN_KEY,
            );
            // save user token
            user.token = token;
            // return user
            return user;
        } catch (error) {
            console.log("Couldn't Login", error);
        }
    }
}
module.exports = userService;