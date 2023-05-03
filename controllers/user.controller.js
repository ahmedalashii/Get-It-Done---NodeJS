const { request } = require('express');
const UserService = require("../services/UserService");

const userController = class UserController {

    static async apiRegister(request, response, next) {
        try {
            const body = request.body;
            if (!body.first_name || !body.last_name || !body.email || !body.password) {
                return response.status(400).json({ message: "Please fill in all the required fields (first_name, last_name, password, email)." });
            }
            const createdUser = await UserService.register(body);
            if (!createdUser) {
                return response.status(404).json({ message: "Couldn't Create New User" });
            }
            if (createdUser.error) {
                return response.status(400).json({ message: createdUser.error });
            }
            return response.status(200).json(createdUser);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }

    static async apiLogin(request, response, next) {
        try {
            const body = request.body;
            if (!body.email || !body.password) {
                return response.status(400).json({ message: "Please fill in all the required fields (email, password)." });
            }
            const user = await UserService.login(body);
            if (!user) {
                return response.status(404).json({ message: "Couldn't Login" });
            }
            if (user.error) {
                return response.status(400).json({ message: user.error });
            }
            return response.status(200).json(user);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }

    //! Note: We can use redis to store the token and check if it's valid or not :)
}
module.exports = userController;