import amqp from 'amqplib';
import config from '../config/index.js';
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


async function consume(queue, callback) {
    try {
        const ch = await getChannel();
        await ch.assertQueue(queue);
        await ch.assertExchange(exchange, 'fanout', { durable: true });
        await ch.bindQueue(queue, exchange, '');

        ch.prefetch(1);

        console.log(`Waiting for messages in ${queue}`);

        ch.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    await callback(content);
                    ch.ack(msg);
                } catch (err) {
                    console.error('Error processing message', err);
                    ch.nack(msg, false, false);
                }
            }
        });
    } catch (error) {
        console.error('Failed to start consumer', error);
        throw error;
    }
}

export default {
    connect,
    getChannel,
    consume
};
