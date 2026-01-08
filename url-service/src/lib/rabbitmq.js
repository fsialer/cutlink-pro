const amqp = require('amqplib');
const config = require('../config')
const exchange = config.rabbitmqExchange || 'clicks_fanout';

let connection = null;
let channel = null;

async function connect() {
    if (connection) return;

    try {
        const url = config.rabbitmqUrl || 'amqp://localhost';
        connection = await amqp.connect(url);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');

        connection.on('error', (err) => {
            console.error('RabbitMQ connection error', err);
            connection = null;
            channel = null;
        });

        connection.on('close', () => {
            console.warn('RabbitMQ connection closed');
            connection = null;
            channel = null;
        });

    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
        throw error;
    }
}

async function getChannel() {
    if (!channel) {
        await connect();
    }
    return channel;
}


async function publish(message) {
    try {
        const ch = await getChannel();
        await ch.assertExchange(exchange, 'fanout', {
            durable: true
        });
        return ch.publish(
            exchange,
            '',
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );
    } catch (error) {
        console.error('Failed to publish message', error);
        throw error;
    }
}

module.exports = {
    connect,
    getChannel,
    publish
};
