import express from 'express'
import config from './config/index.js'
import helmet from 'helmet'
import errorHandler from './middlewares/error.handler.js'
import cors from 'cors'
import { wsProxy } from './middlewares/proxy.middleware.js'
import gatewayRoutes from './routes/gateway.routes.js'

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