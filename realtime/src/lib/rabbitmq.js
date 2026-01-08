const amqp = require('amqplib');
const config = require('../config');
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
            // Retry logic could be added here
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
        // Ensure exchange exists before binding
        await ch.assertExchange(exchange, 'fanout', { durable: true });
        await ch.bindQueue(queue, exchange, '');
        // Prefetch count to limit unacknowledged messages
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
                    // Decide whether to nack (requeue) or ack (discard) based on error type
                    // For now, nack without requeue if processing fails to avoid infinite loops on bad data
                    // Or standard nack with requeue if it's transient
                    ch.nack(msg, false, false);
                }
            }
        });
    } catch (error) {
        console.error('Failed to start consumer', error);
        throw error;
    }
}

module.exports = {
    connect,
    getChannel,
    consume
};
