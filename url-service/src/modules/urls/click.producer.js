const rabbitmq = require('../../lib/rabbitmq');

async function sendClick(clickData) {
    try {
        await rabbitmq.publish(clickData);
    } catch (error) {
        console.error('Failed to send click event', error);
    }
}

module.exports = {
    sendClick
};
