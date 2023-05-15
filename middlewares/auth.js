const jws = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (request, response, next) => {
    const token = request.headers['x-access-token'];

    if (!token) {
        return response.status(403).json({ message: 'A token is required for authentication' });
    }
    try {
        const decoded = jws.verify(token, process.env.JWT_TOKEN_KEY);
        request.user = decoded;
    } catch (error) {
        return response.status(401).json({ message: 'Invalid Token' });
    }
    return next();
}

module.exports = verifyToken;