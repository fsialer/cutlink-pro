const pool = require("../../lib/connect");

module.exports = {
    deleteUrl
}


async function deleteUrl(created_at) {
    const query = "DELETE FROM urls WHERE created_at < ?"
    const [result] = await pool.query(query, [created_at])
    return result
}