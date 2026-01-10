const express = require('express');
const router = express.Router();
const { wsProxy, agPublicProxy, agPrivateProxy } = require('../middlewares/proxy.middleware');
const checkJwt = require('../middlewares/auth.middleware');
const limiter = require('../middlewares/ratelimit.middleware');

// Apply rate limiter to all routes (or specific ones if preferred)
router.use(limiter);

// --- WEBSOCKETS ---
// Handled at server level usually because of 'upgrade' event, 
// but normal HTTP requests to /socket.io can go here too (polling)
router.use('/socket.io', wsProxy);

// --- PUBLIC ROUTES (No Auth) ---
router.use(agPublicProxy);

// --- PRIVATE ROUTES (Auth Required) ---
router.use('/v1/urls', checkJwt, agPrivateProxy);

module.exports = router;
