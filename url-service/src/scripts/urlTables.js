import pool from '../lib/connect.js'

const createUrlTable = `
CREATE TABLE IF NOT EXISTS urls (
    url_id INT AUTO_INCREMENT PRIMARY KEY,
    long_url VARCHAR(500) NOT NULL,
    short_code VARCHAR(255) NOT NULL,
    owner_id VARCHAR(255) NOT NULL,
    clicks INT DEFAULT 0,
    expires_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`

const indexShortCode = `CREATE INDEX idx_short_code ON urls(short_code)`

const existsIndexShortCode = `SELECT COUNT(*) as count FROM information_schema.STATISTICS WHERE TABLE_NAME = 'urls' AND INDEX_NAME = 'idx_short_code' AND TABLE_SCHEMA = DATABASE()`

async function initDb(retries = 10, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            await pool.query(createUrlTable)
            const [rows] = await pool.query(existsIndexShortCode)
            if (rows[0].count === 0) {
                await pool.query(indexShortCode)
                console.log('Index idx_short_code created')
            }
            console.log('Database tables initialized')
            return
        } catch (error) {
            console.error(`Error initializing database (attempt ${i + 1}/${retries}): ${error.message}`)
            if (i === retries - 1) {
                console.error('Could not connect to database after maximum retries')
                process.exit(1)
            }
            await new Promise(res => setTimeout(res, delay))
        }
    }
}

export default initDb