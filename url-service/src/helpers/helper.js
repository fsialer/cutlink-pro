const { nanoid } = require('nanoid');
const urlRepository = require('../modules/urls/url.repository');
const redisRepository = require('../modules/urls/redis.repository');


const getValidUrl = async (url) => {
    if (!url) {
        throw new Error('URL not found')
    }

    // Check if URL has expired
    if (url.expires_at && new Date(url.expires_at) < new Date()) {
        throw new Error('URL has expired');
    }
}

const generateUniqueShortCode = async (length = 6, maxAttempts = 5) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const code = nanoid(length);
        const exists = await urlRepository.obtainUrlByShortCode(code);

        if (!exists) {
            return code;
        }
    }

    throw new Error('Failed to generate unique short code');
}

const calculateExpiration = async (expirationHours) => {
    const date = new Date();

    if (expirationHours && expirationHours > 0) {
        date.setHours(date.getHours() + Number(expirationHours));
    } else {
        date.setFullYear(date.getFullYear() + 1);
    }

    return date.toISOString().slice(0, 19).replace('T', ' ');
}

const enrichWithRealtimeStats = async (url) => {
    if (!url || !url.short_code) return;

    const realtimeClicks = await redisRepository.get(`url:${url.short_code}:clicks`);
    if (realtimeClicks) {
        url.clicks = Math.max(url.clicks || 0, parseInt(realtimeClicks));
    }
}

module.exports = {
    getValidUrl,
    generateUniqueShortCode,
    calculateExpiration,
    enrichWithRealtimeStats
}