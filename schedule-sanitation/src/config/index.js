import dotenv from 'dotenv'
dotenv.config()

const config = {
    dev: process.env.NODE_ENV !== 'production',
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    cronSchedule: process.env.CRON_SCHEDULE
}

export default config
