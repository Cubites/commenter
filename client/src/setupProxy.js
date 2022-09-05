const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app){
    app.use(
        '/book/search',
        createProxyMiddleware({
            target: 'http://localhost:4000',
            changeOrigin: true
        })
    );
};