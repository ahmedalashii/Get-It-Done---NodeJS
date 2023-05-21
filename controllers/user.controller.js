const { request } = require('express');
const UserService = require("../services/UserService");
const createHttpError = require("http-errors");
const userController = class UserController {

    static async apiRegister(request, response, next) {
        try {
            const body = request.body;
            if (!body.first_name || !body.last_name || !body.email || !body.password) {
                const error = createHttpError(400, "Please fill in all the required fields (first_name, last_name, password, email).");
                return next(error);
            }
            const createdUser = await UserService.register(body);
            if (!createdUser) {
                const error = createHttpError(404, "Couldn't Create New User");
                return next(error);
            }
            if (createdUser.status == false) {
                const error = createHttpError(400, createdUser.message);
                return next(error);
            }
            const user = {
                first_name: createdUser.first_name,
                last_name: createdUser.last_name,
                email: createdUser.email,
                created_at: createdUser.created_at,
                token: createdUser.token
            };
            return response.status(200).json({ status: true, message: "User Created Successfully", data: user });
        } catch (error) {
            const err = createHttpError(500, error.message);
            return next(err);
        }
    }

    static async apiLogin(request, response, next) {
        try {
            const body = request.body;
            if (!body.email || !body.password) {
                const error = createHttpError(400, "Please fill in all the required fields (email, password).");
                return next(error);
            }
            const loggedInUser = await UserService.login(body);
            if (!loggedInUser) {
                const error = createHttpError(404, "Couldn't Login");
                return next(error);
            }
            if (loggedInUser.status == false) {
                const error = createHttpError(400, loggedInUser.message);
                return next(error);
            }
            const user = {
                first_name: loggedInUser.first_name,
                last_name: loggedInUser.last_name,
                email: loggedInUser.email,
                created_at: loggedInUser.created_at,
                token: loggedInUser.token
            };
            return response.status(200).json({ status: true, message: "Logged In Successfully", data: user });
        } catch (error) {
            const err = createHttpError(500, error.message);
            return next(err);
        }
    }

    static async apiLogout(request, response, next) {
        try {
            const isLoggedOut = await UserService.logout(request);
            if (!isLoggedOut) {
                const error = createHttpError(404, "Couldn't Logout");
                return next(error);
            }
            return response.status(200).json({ status: true, message: "Logged Out Successfully" });
        } catch (error) {
            const err = createHttpError(500, error.message);
            return next(err);
        }
    }


    //! Note: We can use redis to store the token and check if it's valid or not :)
}
module.exports = userController;