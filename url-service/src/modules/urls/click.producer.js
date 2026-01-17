import amqp from 'amqplib';
import config from '../../config/index.js';
import rabbitmq from '../../lib/rabbitmq.js';

async function sendClick(clickData) {
    try {
        await rabbitmq.publish(clickData);
    } catch (error) {
        console.error('Failed to send click event', error);
    }
}

export default { sendClick };
