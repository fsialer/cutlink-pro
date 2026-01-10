const express = require('express')
const config = require('./config')
const helmet = require('helmet')
const checkJwt = require('./middlewares/auth.middleware')
const errorHandler = require('./middlewares/error.handler')
const cors = require('cors')
const { wsProxy, agPublicProxy, agPrivateProxy } = require('./middlewares/proxy.middleware')

const app = express()
app.use(helmet())
app.use(cors())

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/socket.io', wsProxy);
// --- RUTAS PÚBLICAS ---
app.use(agPublicProxy);
// --- RUTAS PRIVADAS ---
app.use('/v1/urls', checkJwt, agPrivateProxy);
// Middleware de manejo de errores de autenticación
app.use(errorHandler);

const server = app.listen(config.port, () => console.log(`API Gateway running on port ${config.port}`));
server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/socket.io')) {
        wsProxy.upgrade(req, socket, head);
    }
});