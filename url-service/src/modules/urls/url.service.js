const urlRepository = require('./url.repository')
const redisRepository = require('./redis.repository')
const clickProducer = require('../urls/click.producer')
const { nanoid } = require('nanoid');

module.exports = {
    getAllUrls,
    createUrl,
    getUrl,
    updateUrl,
    deleteUrl,
    incrementClick,
    getPublicUrl
}

async function getPublicUrl(shortCode) {
    const url = await urlRepository.obtainUrlByShortCode(shortCode);
    if (!url) {
        throw new Error('URL not found')
    }

    // Check if URL has expired
    if (url.expires_at && new Date(url.expires_at) < new Date()) {
        throw new Error('URL has expired');
    }

    return url;
}

async function getAllUrls(userId) {
    return await urlRepository.getUrls(userId)
}

async function createUrl(url) {
    let shortCode;
    let isUnique = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while (!isUnique && attempts < MAX_ATTEMPTS) {
        shortCode = nanoid(6);
        const existingUrl = await urlRepository.obtainUrlByShortCode(shortCode);
        if (!existingUrl) {
            isUnique = true;
        }
        attempts++;
    }

    if (!isUnique) {
        throw new Error('Failed to generate unique short code');
    }

    url.short_code = shortCode;

    // Calculate expiration based on expiration_hours sent from client
    if (url.expiration_hours && url.expiration_hours > 0) {
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + parseInt(url.expiration_hours));
        url.expires_at = expirationDate.toISOString().slice(0, 19).replace('T', ' ');
    } else {
        // Default: 1 year from now if no expiration specified
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        url.expires_at = oneYearFromNow.toISOString().slice(0, 19).replace('T', ' ');
    }

    // Remove expiration_hours from the object before inserting to DB
    delete url.expiration_hours;

    const result = await urlRepository.createUrl(url);
    if (result.insertId > 0) {
        return { 'short_code': url.short_code }
    } else {
        throw new Error('URL not created');
    }
}

async function getUrl(urlId, userId) {
    const url = await urlRepository.getUrl(urlId)
    if (!url || url.owner_id !== userId) {
        throw new Error('Unauthorized')
    }

    // Enrich with real-time stats
    await enrichWithRealtimeStats(url);

    return url;
}

async function updateUrl(urlId, url, userId) {
    const existingUrl = await urlRepository.getUrl(urlId)
    if (!existingUrl || existingUrl.owner_id !== userId) {
        throw new Error('Unauthorized')
    }
    const { long_url } = url
    return await urlRepository.updateUrl(urlId, long_url)
}

async function deleteUrl(urlId, userId) {
    const existingUrl = await urlRepository.getUrl(urlId)
    if (!existingUrl || existingUrl.owner_id !== userId) {
        throw new Error('Unauthorized')
    }
    return await urlRepository.deleteUrl(urlId)
}

async function incrementClick(short_code, owner_id, db_clicks) {
    const key = `url:${short_code}:clicks`
    const TTL = 3600; // 1 hour expiration

    // 1. Initialize logic: Try to set the key with DB value ONLY if it doesn't exist.
    // This allows us to "resume" counting from the DB value if Redis expired.
    // If key exists, this does nothing (returns null/false).
    await redisRepository.setNxEx(key, db_clicks || 0, TTL);

    // 2. Increment the value in Redis
    const newClicks = await redisRepository.increment(key);

    // 3. Refresh the expiration (so active links stay in memory)
    await redisRepository.expire(key, TTL);

    // 4. Send event to persistent storage (DB)
    clickProducer.sendClick({ 'clicks': newClicks, 'short_code': short_code, 'owner_id': owner_id })
        .catch(err => console.error('Error sending click to queue', err));

    return newClicks;
}

async function enrichWithRealtimeStats(url) {
    if (!url || !url.short_code) return;

    const realtimeClicks = await redisRepository.get(`url:${url.short_code}:clicks`);
    if (realtimeClicks) {
        url.clicks = Math.max(url.clicks || 0, parseInt(realtimeClicks));
    }
}