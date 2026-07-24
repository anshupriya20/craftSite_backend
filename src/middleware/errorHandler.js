const errorHandler = (err, req, res, next) => {
    console.log(err.stack);

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        message: err.message || "Server error",
    });
};

module.exports = errorHandler;