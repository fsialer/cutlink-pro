const express = require('express')
const config = require('./config')
const { createProxyMiddleware } = require('http-proxy-middleware')
const helmet = require('helmet')
const checkJwt = require('./middlewares/auth.middleware')
const errorHandler = require('./middlewares/errorHandler')
const cors = require('cors')

const app = express()
app.use(helmet())
app.use(cors())

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});


const wsProxy = createProxyMiddleware({
    target: config.realtimeUrl,
    ws: true,
    changeOrigin: true,
    logLevel: 'debug',
    on: {
        proxyReq: (proxyReq, req, res) => {
            const userId = req.auth?.payload?.sub || 'anonymous';
            proxyReq.setHeader(
                'x-internal-secret',
                config.internalSecret
            );
            proxyReq.setHeader('x-user-id', userId);
        }
    }
});

app.use('/socket.io', wsProxy);

// --- RUTAS PÚBLICAS ---
app.use(createProxyMiddleware({
    pathFilter: '/v1/urls/public',
    target: config.urlServiceUrl,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: { '^/v1/urls/public': '/public' },
    on: {
        proxyReq: (proxyReq, req, res) => {
            // Internal secret for security
            proxyReq.setHeader('x-internal-secret', config.internalSecret)
        }
    }
})
);

// --- RUTAS PRIVADAS ---
// Esta ruta capturará TODO lo que no sea /public
app.use('/v1/urls', checkJwt,
    createProxyMiddleware({
        target: config.urlServiceUrl,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
            '^/v1/urls': '', // Quita el prefijo del gateway para que llegue limpio al router
        },
        on: {
            proxyReq: (proxyReq, req, res) => {
                // Extraemos el sub (ID de usuario) del token valido
                const userId = req.auth?.payload?.sub || 'anonymous';
                // Lo enviamos a como header al microservicio
                proxyReq.setHeader('x-user-id', userId);
                // Firma de seguridad interna para validar que viene del gateway
                proxyReq.setHeader('x-internal-secret', config.internalSecret)
            }
        }
    })
);



// Middleware de manejo de errores de autenticación
app.use(errorHandler);

const server = app.listen(config.port, () => console.log(`API Gateway running on port ${config.port}`));
server.on('upgrade', (req, socket, head) => {
    // Si la ruta es /socket.io, el proxy debe manejar el upgrade
    if (req.url.startsWith('/socket.io')) {
        wsProxy.upgrade(req, socket, head);
    }
});