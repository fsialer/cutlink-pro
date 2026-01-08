// 1. Verificion OIDC 
const { auth } = require('express-oauth2-jwt-bearer')
const config = require('../config')

const checkJwt = auth({
    audience: 'account',
    jwksUri: `${config.authIssuer}/protocol/openid-connect/certs`, // Fetch keys from Internal Docker Network
    issuer: 'http://localhost:8080/realms/cutlink_reaml', // Validate against External Host URL
    clockTolerance: 30
})

module.exports = checkJwt