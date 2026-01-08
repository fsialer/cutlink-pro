const dotenv = require('dotenv')
dotenv.config()

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 4000,
    authIssuer: process.env.AUTH_ISSUER ? process.env.AUTH_ISSUER.trim() : '',
    urlServiceUrl: process.env.URL_SERVICE_URL ? process.env.URL_SERVICE_URL.trim() : '',
    internalSecret: process.env.INTERNAL_SECRET ? process.env.INTERNAL_SECRET.trim() : '',
    realtimeUrl: process.env.REALTIME_URL ? process.env.REALTIME_URL.trim() : '',
}

module.exports = config