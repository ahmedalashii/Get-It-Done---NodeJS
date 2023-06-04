const returnJson = (response, statusCode, status, message, data) => {
    return response.status(statusCode).json({
        status: {
            status: status,
            message: message,
        },
        data: data,
    });
}

module.exports = returnJson;