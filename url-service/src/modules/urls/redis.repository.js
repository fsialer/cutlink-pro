import redisClient from '../../lib/redis.js';

export default {
    increment,
    get,
    setNxEx,
    expire
}

/**
 * Get the value of a key in Redis.
 * @param {string} key - The key to get the value for.
 * @returns {Promise<string>} - A promise that resolves to the value of the key.
 */
async function get(key) {
    return await redisClient.get(key)
}

/**
 * Increment the value of a key in Redis.
 * @param {string} key - The key to increment.
 * @returns {Promise<number>} - A promise that resolves to the new value of the key.
 */
async function increment(key) {
    return await redisClient.incr(key)
}


/**
 * Set a key-value pair in Redis with an expiration time and only if the key does not exist.
 * @param {string} key - The key to set.
 * @param {string} value - The value to set.
 * @param {number} ttl - The time-to-live in seconds.
 * @returns {Promise<boolean>} - A promise that resolves to true if the key was set, false otherwise.
 */
async function setNxEx(key, value, ttl) {
    return await redisClient.set(key, String(value), {
        EX: ttl,
        NX: true
    })
}

/**
 * Set an expiration time for a key in Redis.
 * @param {string} key - The key to set the expiration time for.
 * @param {number} ttl - The time-to-live in seconds.
 * @returns {Promise<boolean>} - A promise that resolves to true if the key was set, false otherwise.
 */
async function expire(key, ttl) {
    return await redisClient.expire(key, ttl)
}
