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
                created_at: new Date(),
            });
            // Create a token
            const token = jwt.sign(
                { user_id: user._id, email },
                { expiresIn: "1d", },
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
                { user_id: user._id, email, },
                {
                    expiresIn: "1d",
                    /*
                        When logging out, the client will just delete the token he stored (e.i. browser local storage).
                        In that case, the client won’t have a token to put in the request, thus causing unauthorized response status ..
                    */
                },
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


    static async logout(request) {
        /*
            Usually, when using JWT authentication, 
            the client side stores the token somewhere and attaches it to every request that needs authentication.
            So, the first thing to do when logging out is just to delete the token you stored on the client (e.i. browser local storage).
            In that case, the client won’t have a token to put in the request, thus causing unauthorized response status
            But is that enough? Well, that specific client (browser, app) won’t be authenticated anymore,
            but the token still exists somewhere and it is still valid! If someone has copied the token from the request before, 
            he/she would still be able to perform requests on behalf of the user! 👾 You can easily try this out on your own.
            “Okay, so let’s log out the user from the backend!” you would say. But hold down the horses. It’s not that simple with JWT. You cannot delete the session or cookie and get going.

            Actually, JWT serves a different purpose than a session and it is not possible to forcefully delete or invalidate an existing token.
            
            ^ Statelessness?
            The whole point of JWT is to be stateless.
            It is said that using JWT should be stateless, 
            meaning that you should store everything you need in the payload and skip performing a DB query on every request.
            But if you plan to have a strict log out functionality, that cannot wait for the token auto-expiration, 
            even though you have cleaned the token from the client side, 
            then you might need to neglect the stateless logic and do some queries.
            * An implementation would probably be, to store a so-called “blacklist” of all the tokens that are valid no more and have not expired yet.            
          */
    }
}
module.exports = userService;