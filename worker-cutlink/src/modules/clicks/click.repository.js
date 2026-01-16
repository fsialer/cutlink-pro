import pool from '../../lib/connect.js'

export {
    updateClicks
}
async function updateClicks(shortCode) {
    const query = "UPDATE urls SET clicks = COALESCE(clicks, 0) + 1 WHERE short_code = ?";
    const values = [shortCode];
    const [result] = await pool.query(query, values);
    return result
}
