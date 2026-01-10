const config = require('../config')
const verifyGatewayRequest = (req, res, next) => {
    const secret = req.headers['x-internal-secret'];
    if (secret !== config.internalSecret) {
        return res.status(403).json({ message: 'Unauthorized: Invalid internal secret' })
    }
    next();
};

module.exports = verifyGatewayRequest