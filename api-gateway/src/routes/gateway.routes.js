import express from 'express';
import { wsProxy, agPublicProxy, agPrivateProxy } from '../middlewares/proxy.middleware.js';
import checkJwt from '../middlewares/auth.middleware.js';
import limiter from '../middlewares/ratelimit.middleware.js';

const router = express.Router();

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

export default router;
