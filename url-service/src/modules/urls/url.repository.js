import pool from '../../lib/connect.js'

export default {
    getUrls,
    getUrl,
    createUrl,
    updateUrl,
    deleteUrl,
    obtainUserIdByUrlId,
    obtainUrlByShortCode
}

async function obtainUrlByShortCode(shortCode) {
    const query = "SELECT * FROM urls WHERE short_code = ?"
    const [rows] = await pool.query(query, [shortCode])
    return rows[0]
}

async function getUrls(userId) {
    const query = "SELECT * FROM urls WHERE owner_id = ? ORDER BY created_at DESC;"
    const [rows] = await pool.query(query, [userId])
    return rows
}

async function createUrl(url) {
    const query = "INSERT INTO urls SET ?"
    const [result] = await pool.query(query, [url])
    return result
}

async function getUrl(urlId) {
    const query = "SELECT * FROM urls WHERE url_id = ?"
    const [rows] = await pool.query(query, [urlId])
    return rows[0]
}

async function updateUrl(urlId, longUrl) {
    const query = "UPDATE urls SET long_url = ? WHERE url_id = ?"
    const [result] = await pool.query(query, [longUrl, urlId])
    return result
}

async function deleteUrl(urlId) {
    const query = "DELETE FROM urls WHERE url_id = ?"
    const [result] = await pool.query(query, [urlId])
    return result
}

async function obtainUserIdByUrlId(urlId) {
    const query = "SELECT owner_id FROM urls WHERE url_id = ?"
    const [rows] = await pool.query(query, [urlId])
    return rows[0]
}