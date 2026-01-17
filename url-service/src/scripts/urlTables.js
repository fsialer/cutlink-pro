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

async function initDb(retries = 10, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            await pool.query(createUrlTable)
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