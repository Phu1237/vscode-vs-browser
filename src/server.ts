const http = require('http');
const connect = require('connect');
const fs = require('fs');
const path = require('path');
const morgan = require("morgan");
var modifyResponse = require('http-proxy-response-rewrite');

let app = connect();
var httpProxy = require('http-proxy');

// Configuration
const PORT = 3000;
const HOST = "localhost";

var proxy = httpProxy.createProxyServer();

proxy.on('proxyRes', function (proxyRes, req, res) {
	if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
		console.log(proxyRes.headers.location);
		res.writeHead(301, {
			'Location': 'http://'+HOST+':'+PORT+'/'+proxyRes.headers.location
		});
		res.end();
	}
});

export function start() {
	// Create the express app
	app.use(morgan('dev'));

	app.use(function (req, res) {
		let options = {
			target: null,
			changeOrigin: true,
			ssl: {
				key: fs.readFile(path.resolve(__dirname, "ssl/key.pem"), function read(err, data) {
				}),
				cert: fs.readFile(path.resolve(__dirname, "ssl/cert.pem"), function read(err, data) {
				})
			},
			secure: false,
			hostRewrite: true,
			autoRewrite: true,
		};
		let url = req.url;
		let regex = /(http(|s))\:\/\/([^\/]+)*/g;
		url = url.match(regex)[0];
		options.target = url;
		req.url = req.url.split('/').splice(4).join('/');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('X-Frame-Options', false);

		proxy.web(req, res, options);
	});

	http.createServer(app).listen(PORT);
}