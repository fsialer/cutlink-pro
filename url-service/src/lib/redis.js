import config from '../config/index.js'
import redis from 'redis'

const redisClient = redis.createClient({
    url: `redis://${config.redisHost}:${config.redisPort}`,
})
redisClient.on('error', (err) => console.error('Redis Client Error', err));

// IMPORTANTE: En v4 hay que conectar el cliente
redisClient.connect().catch(console.error);
export default redisClient 