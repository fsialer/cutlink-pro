const rabbitmq = require('./lib/rabbitmq');
const { processClick } = require('./modules/clicks/click.consumer');
const config = require('../src/config')

const queueName = config.rabbitmqQueue || 'clicks'

async function startWorker() {
    console.log('Starting URL Worker...');
    try {
        // Connect to RabbitMQ
        await rabbitmq.connect();

        // Start Consumer
        await rabbitmq.consume(queueName, processClick);

        console.log('URL Worker started successfully.');
    } catch (error) {
        console.error('Failed to start URL Worker', error);
        process.exit(1);
    }
}

startWorker();
