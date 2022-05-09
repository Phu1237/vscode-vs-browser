import { nextTick } from "process";

const http = require('http');
const connect = require('connect');
const fs = require('fs');
const path = require('path');
const morgan = require("morgan");

let app = connect();
var httpProxy = require('http-proxy');

// Configuration
const PORT = 3000;
const HOST = "localhost";

var proxy = httpProxy.createProxyServer();

export function start() {
	// Create the express app
	app.use(function (req, res, next) {
		let url = req.url;
		let regex = /(http(|s))\:\/\/([^\/]+)*/g;
		url = url.match(regex)[0];

		res.write = function (data) {
			console.log(data);
			res.write.call(res, data.toString().replace('https://', "http://"));
		};

		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('X-Frame-Options', false);

		next();
	});

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
			secure: false
		};
		let url = req.url;
		let regex = /(http(|s))\:\/\/([^\/]+)*/g;
		url = url.match(regex)[0];
		options.target = url;
		req.url = req.url.split('/').splice(4).join('/');

		proxy.web(req, res, options);
	});

	http.createServer(app).listen(PORT);
}