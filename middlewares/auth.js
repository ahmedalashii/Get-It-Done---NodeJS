const jws = require('jsonwebtoken');
require('dotenv').config();
const createHttpError = require('http-errors');
const { ObjectId } = require('bson');

const verifyToken = (request, response, next) => {
    var token = request.headers['x-access-token'];
    if (!token) {
        token = request.headers.authorization; // Bearer Token
        if (!token) {
            const error = createHttpError(403, 'A token is required for authentication');
            return response.status(error.statusCode).json({ status: false, message: error.message });
        }
        token.startsWith('Bearer ') ? token = token.slice(7, token.length) : null;
    }
    try {
        const decoded = jws.verify(token, process.env.JWT_TOKEN_KEY);
        request.user = decoded;
        request.user.user_id = new ObjectId(request.user.user_id);
    } catch (err) {
        const error = createHttpError(500, err.message);
        return response.status(error.statusCode).json({ status: false, message: error.message });
    }
    return next();
}

module.exports = verifyToken;