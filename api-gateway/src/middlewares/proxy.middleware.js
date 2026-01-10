const { createProxyMiddleware } = require('http-proxy-middleware')
const config = require('../config')

const wsProxy = createProxyMiddleware({
    target: config.realtimeUrl,
    ws: true,
    changeOrigin: true,
    logLevel: 'debug',
    on: {
        proxyReq: (proxyReq, req, res) => {
            const userId = req.auth?.payload?.sub || 'anonymous';
            proxyReq.setHeader(
                'x-internal-secret',
                config.internalSecret
            );
            proxyReq.setHeader('x-user-id', userId);
        }
    }
});

const agPublicProxy = createProxyMiddleware({
    pathFilter: '/v1/urls/public',
    target: config.urlServiceUrl,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: { '^/v1/urls/public': '/public' },
    on: {
        proxyReq: (proxyReq, req, res) => {
            const userId = req.auth?.payload?.sub || 'anonymous';
            proxyReq.setHeader(
                'x-internal-secret',
                config.internalSecret
            );
            proxyReq.setHeader('x-user-id', userId);
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
    on: {
        proxyReq: (proxyReq, req, res) => {
            const userId = req.auth?.payload?.sub || 'anonymous';
            proxyReq.setHeader(
                'x-internal-secret',
                config.internalSecret
            );
            proxyReq.setHeader('x-user-id', userId);
        }
    }
});

module.exports = {
    wsProxy,
    agPublicProxy,
    agPrivateProxy
}