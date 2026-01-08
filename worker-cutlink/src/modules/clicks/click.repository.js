const pool = require('../../lib/connect')

module.exports = {
    updateClicks
}
async function updateClicks(shortCode) {
    const query = "UPDATE urls SET clicks = COALESCE(clicks, 0) + 1 WHERE short_code = ?";
    const values = [shortCode];
    const [result] = await pool.query(query, values);
    return result
}
