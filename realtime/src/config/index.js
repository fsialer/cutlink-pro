import dotenv from 'dotenv'
dotenv.config()

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3005,
    rabbitmqUrl: process.env.RABBITMQ_URL,
    rabbitmqQueue: process.env.RABBITMQ_QUEUE,
    eventWebsocket: process.env.EVENT_WEBSOCKET,
    rabbitmqExchange: process.env.RABBITMQ_EXCHANGE
}

export default config
