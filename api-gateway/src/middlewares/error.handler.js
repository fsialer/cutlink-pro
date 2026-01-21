function errorHandler(err, req, res, next) {
    console.error('--- GATEWAY ERROR HANDLER ---');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);

    if (err.name === 'InvalidTokenError') {
        return res.status(401).json({
            error: 'InvalidTokenError',
            message: 'Token invalid',
            details: err.message
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or missing token',
            details: err.message
        });
    }
    res.status(500).json({ error: 'Gateway Error', message: err.message });
}

export default errorHandler
