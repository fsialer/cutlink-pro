import { createProxyMiddleware } from 'http-proxy-middleware'
import config from '../config/index.js'

const wsProxy = createProxyMiddleware({
    target: config.realtimeUrl,
    ws: true,
    changeOrigin: true,
    logLevel: 'debug',
    proxyTimeout: 3600000, // Long timeout for WebSockets (1 hour)
    on: {
        proxyReq: (proxyReq, req, res) => {
            const userId = req.auth?.payload?.sub || 'anonymous';
            proxyReq.setHeader(
                'x-internal-secret',
                config.internalSecret
            );
            proxyReq.setHeader('x-user-id', userId);
        },
        error: (err, req, res) => {
            console.error('WebSocket Proxy Error:', err);
            res.status(502).json({ message: 'Bad Gateway', details: 'Real-time service unavailable' });
        }
    }
});

const agPublicProxy = createProxyMiddleware({
    pathFilter: '/v1/urls/public',
    target: config.urlServiceUrl,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: { '^/v1/urls/public': '/public' },
    proxyTimeout: 5000, // 5 seconds
    timeout: 5000,
    on: {
        proxyReq: (proxyReq, req, res) => {
            const userId = req.auth?.payload?.sub || 'anonymous';
            proxyReq.setHeader(
                'x-internal-secret',
                config.internalSecret
            );
            proxyReq.setHeader('x-user-id', userId);
        },
        error: (err, req, res) => {
            console.error('Public Proxy Error:', err);
            // Handle timeout specifically if code is ECONNRESET or ETIMEDOUT (though middleware handles some)
            res.status(502).json({ message: 'Bad Gateway', details: 'Service unavailable or timed out' });
        }
    }
});

const agPrivateProxy = createProxyMiddleware({
    target: config.urlServiceUrl,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
        '^/v1/urls': '',
    },
    proxyTimeout: 5000, // 5 seconds
    timeout: 5000,
    on: {
        proxyReq: (proxyReq, req, res) => {
            const userId = req.auth?.payload?.sub || 'anonymous';
            proxyReq.setHeader(
                'x-internal-secret',
                config.internalSecret
            );
            proxyReq.setHeader('x-user-id', userId);
        },
        error: (err, req, res) => {
            console.error('Private Proxy Error:', err);
            res.status(502).json({ message: 'Bad Gateway', details: 'Service unavailable or timed out' });
        }
    }
});

export {
    wsProxy,
    agPublicProxy,
    agPrivateProxy
}