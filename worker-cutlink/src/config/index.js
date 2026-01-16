import dotenv from 'dotenv'
dotenv.config()

const config = {
    dev: process.env.NODE_ENV !== 'production',
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    rabbitmqUrl: process.env.RABBITMQ_URL,
    rabbitmqQueue: process.env.RABBITMQ_QUEUE,
    rabbitmqExchange: process.env.RABBITMQ_EXCHANGE
}

export default config
