const verifyGatewayRequest = (req, res, next) => {
    const secret = req.headers['x-gateway-secret'];
    if (secret !== process.env.INTERNAL_SECRET) {
        return res.status(403).send("Acceso denegado: Solo se permite tráfico del Gateway");
    }
    next();
};

module.exports = verifyGatewayRequest