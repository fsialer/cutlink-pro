import boom from '@hapi/boom';

function errorHandler(err, req, res, next) {
    let error = err;

    // If it's a Joi validation error (from your existing code or libraries)
    if (error.isJoi) {
        error = boom.badRequest(error.message);
    }

    // If it's not a Boom error, wrap it in a Boom error (internal 500)
    if (!error.isBoom) {
        console.error('Unknown Error:', error); // Log the real error for debugging
        error = boom.badImplementation(error.message || 'Internal Server Error');
    }

    const { output } = error;

    // Respond with JSON
    res.status(output.statusCode).json(output.payload);
}

export default errorHandler;
