import dotenv from 'dotenv'
dotenv.config()

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3001,
    internalSecret: process.env.INTERNAL_SECRET,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    rabbitmqUrl: process.env.RABBITMQ_URL,
    rabbitmqQueue: process.env.RABBITMQ_QUEUE,
    rabbitmqExchange: process.env.RABBITMQ_EXCHANGE
}

export default config
