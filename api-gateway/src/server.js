const express = require('express')
const config = require('./config')
const helmet = require('helmet')
const errorHandler = require('./middlewares/error.handler')
const cors = require('cors')
const { wsProxy } = require('./middlewares/proxy.middleware')
const gatewayRoutes = require('./routes/gateway.routes')

const app = express()

// Security Headers
app.use(helmet())

// Strict CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Defaults to * but should be set in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-Internal-Secret']
}));

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Routes
app.use(gatewayRoutes);

// Error Handling
app.use(errorHandler);

const server = app.listen(config.port, () => console.log(`API Gateway running on port ${config.port}`));

// WebSocket Upgrade Handling
server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/socket.io')) {
        wsProxy.upgrade(req, socket, head);
    }
});