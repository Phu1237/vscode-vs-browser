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

// proxy.on('proxyReq', (proxyReq, req) => {
// 	if (req.body) {
// 		const bodyData = JSON.stringify(req.body);
// 		// incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
// 		proxyReq.setHeader('Content-Type', 'application/json');
// 		proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
// 		// stream the content
// 		proxyReq.write(bodyData);
// 		console.log('Has body', bodyData);
// 	}
// 	console.log('ProxyReq', req.method);
// });

proxy.on('proxyRes', function (proxyRes, req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Frame-Options', false);
  if (proxyRes.headers['content-type']) {
    res.setHeader('Content-Type', proxyRes.headers['content-type']);
  }

  var body: any = [];
  proxyRes.on('data', function (chunk: any) {
    body.push(chunk);
  });

  proxyRes.on('end', function () {
    body = Buffer.concat(body).toString('utf-8');
    if (res.hasHeader('Content-Type') && res.getHeader('Content-Type').match(/([^;]+)*/g)[0] === 'text/html') {
      let url = req.originalUrl;
      let regex = /(http(|s))\:\/\/([^\/]+)*/g;
      url = url.match(regex)[0];

      body = body.replaceAll(/<([^a|img]+)(.*?) (src|href)=('|"|)((http(|s))\:\/\/([^\/"]+)*)/g, '<$1$2 $3=$4http://' + HOST + ':' + PORT + '/' + url);
      body = body.replaceAll(/(src|href)=('|"|)\//g, '$1=$2http://' + HOST + ':' + PORT + '/' + url + '/');
    }
    res.write(body);
    res.end();
  });
  if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
    res.writeHead(301, {
      'location': 'http://' + HOST + ':' + PORT + '/' + proxyRes.headers.location
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
      ssl: {
        key: fs.readFile(path.resolve(__dirname, "ssl/key.pem"), function read(err, data) {
        }),
        cert: fs.readFile(path.resolve(__dirname, "ssl/cert.pem"), function read(err, data) {
        })
      },
      xfwd: true,
      secure: false,
      changeOrigin: true,
      hostRewrite: true,
      autoRewrite: true,
      toProxy: true,
      selfHandleResponse: true
    };
    // Set the default response headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Frame-Options', false);

    let url = req.url;
    let regex = /(http(|s))\:\/\/([^\/]+)*/g;
    if (regex.test(url)) {
      url = url.match(regex)[0];
      options.target = url;
      req.url = req.url.split('/').splice(4).join('/');

      proxy.web(req, res, options);
    } else {
      res.writeHead(400, { 'contentType': 'text/html' });
      res.write('Invalid request');
      res.end();
    }
  });

  http.createServer(app).listen(PORT);
}