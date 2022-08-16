const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app){
    app.use(
        '/book', '/comment', 'user', 'qna',
        createProxyMiddleware({
            target: 'http://localhost:4000',
            changeOrigin: true
        })
    );
};