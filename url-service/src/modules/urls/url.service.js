const urlRepository = require('./url.repository')
const redisRepository = require('./redis.repository')
const clickProducer = require('../urls/click.producer')
const { nanoid } = require('nanoid');
const helper = require('../../helpers/helper');

module.exports = {
    getAllUrls,
    createUrl,
    deleteUrl,
    incrementClick,
    getPublicUrl
}

async function getPublicUrl(shortCode) {
    const url = await urlRepository.obtainUrlByShortCode(shortCode);
    await helper.getValidUrl(url)
    return url;
}

async function getAllUrls(userId) {
    return await urlRepository.getUrls(userId)
}

async function createUrl(url) {
    url.short_code = await helper.generateUniqueShortCode();
    url.expires_at = await helper.calculateExpiration(url.expiration_hours);
    delete url.expiration_hours;
    const result = await urlRepository.createUrl(url);
    if (result.insertId > 0) {
        return { 'short_code': url.short_code }
    } else {
        throw new Error('URL not created');
    }
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
    const TTL_IN_SECONDS = 3600;
    const url = await urlRepository.obtainUrlByShortCode(short_code);
    await helper.getValidUrl(url)
    await redisRepository.setNxEx(key, db_clicks || 0, TTL_IN_SECONDS);
    const newClicks = await redisRepository.increment(key);
    await redisRepository.expire(key, TTL_IN_SECONDS);
    clickProducer.sendClick(
        {
            'clicks': newClicks,
            'short_code': short_code,
            'owner_id': owner_id
        })
        .catch(err => console.error('Error sending click to queue', err));

    return newClicks;
}