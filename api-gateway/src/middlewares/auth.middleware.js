// 1. Verificion OIDC 
import { auth } from 'express-oauth2-jwt-bearer'
import config from '../config/index.js'

const checkJwt = auth({
    audience: 'account',
    jwksUri: config.jwksUri, // Fetch keys from Internal Docker Network
    issuer: config.authIssuer, // Validate against External Host URL
    clockTolerance: 30
})

export default checkJwt