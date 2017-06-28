/**
 * Created by yue on 16/8/28.
 */
var httpProxy = require('http-proxy');
var chalk = require('chalk');
var os = require('os');
var argv = require('yargs').argv;
/*
 * Location of your backend server
 */
//var proxyTarget = 'http://127.0.0.1:8081';

var proxy = httpProxy.createProxyServer({
    "xfwd": true,
    "changeOrigin": true,
    "autoRewrite": true,
    "protocolRewrite": true
});

proxy.on('error', function (error, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    console.error(chalk.red('[Proxy]'), error);
});

// proxy.on('proxyRes', function (proxyRes, req, res) {
//     if(req.method === 'GET' && proxyRes.statusCode === 302 && req.url.includes("/user/current") && proxyRes.headers.location.includes("login.html")) {
//         proxyRes.headers.location = "http://localhost:3000/login.html";
//     }
//     if(req.url.includes("login.html") && req.method === 'POST'){
//         proxyRes.headers.location = "http://localhost:3000/application/index.html";
//     }
// });

/*
 * The proxy middleware is an Express middleware added to BrowserSync to
 * handle backend request and proxy them to your backend.
 */
module.exports = function (options) {
    if (argv.production || argv.prod) {
        options.target = "https://app.convertlab.com"
    } else if (argv.test) {
        options.target = "https://app.51convert.cn"
    } else if (argv.validation || argv.stage) {
        options.target = "https://app.convertwork.cn"
    } else if (argv.local) {
        options.target = "http://localhost:7653"
    }

    console.log('Backend server: ' + options.target)
    function proxyMiddleware(req, res, next) {
        /*
         * This test is the switch of each request to determine if the request is
         * for a static file to be handled by BrowserSync or a backend request to proxy.
         *
         * The existing test is a standard check on the files extensions but it may fail
         * for your needs. If you can, you could also check on a context in the url which
         * may be more reliable but can't be generic.
         */
        if (req.url.includes("/css")|| req.url.indexOf("/js") === 0 || req.url.indexOf("/fonts") === 0 || req.url.indexOf("/assets") === 0) {
            next();

        }else {
            console.log('(bc request)', req.url);

            proxy.web(req, res, {target: options.target, secure: false});

        }
    }

    return [proxyMiddleware];
};
