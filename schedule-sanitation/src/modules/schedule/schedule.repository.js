import pool from "../../lib/connect.js";

export default {
    deleteUrl
}


async function deleteUrl(created_at) {
    const query = "DELETE FROM urls WHERE created_at < ?"
    const [result] = await pool.query(query, [created_at])
    return result
}