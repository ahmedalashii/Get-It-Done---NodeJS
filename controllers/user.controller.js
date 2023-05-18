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
            // exclude password from the response
            createdUser.password = undefined;
            return response.status(200).json({ status: true, message: "User Created Successfully", data: createdUser });
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
            const user = await UserService.login(body);
            if (!user) {
                const error = createHttpError(404, "Couldn't Login");
                return next(error);
            }
            if (user.status == false) {
                const error = createHttpError(400, user.message);
                return next(error);
            }
            // exclude password from the response
            user.password = undefined;
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