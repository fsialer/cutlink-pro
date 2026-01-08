const express = require('express')
const { Server } = require("socket.io");
const http = require('http');
const rabbitmq = require('./lib/rabbitmq');
const config = require('../src/config')

const app = express()

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

// 1. Manejo de salas de Socket.io
io.on("connection", (socket) => {
    const { owner_id } = socket.handshake.query;
    if (owner_id) socket.join(owner_id);
});

// 2. Definimos la lógica de qué hacer cuando llega un mensaje
// Creamos una función que ya tiene acceso a 'io'
const processClickWithIO = (ioInstance) => {
    return async (content) => {
        const { owner_id, short_code, clicks } = content;

        console.log(`Emitiendo actualización a ${owner_id}: ${clicks} clicks`);

        // Enviamos el mensaje solo a los interesados
        ioInstance.to(owner_id).emit(config.eventWebsocket, {
            short_code,
            clicks
        });
    };
};

// 3. Arrancamos RabbitMQ y pasamos nuestra función procesadora
async function start() {
    await rabbitmq.connect();

    // Aquí está el secreto: Inyectamos 'io' en la lógica de procesamiento
    await rabbitmq.consume(config.rabbitmqQueue, processClickWithIO(io));

    httpServer.listen(config.port, () => {
        console.log(`Realtime Service running on port ${config.port}`);
    });
}

start().catch(console.error);