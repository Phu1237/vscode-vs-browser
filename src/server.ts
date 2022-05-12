import * as vscode from 'vscode';

const http = require('http');
const connect = require('connect');
const fs = require('fs');
const path = require('path');
const morgan = require("morgan");
const zlib = require('zlib');

let app = connect();
var httpProxy = require('http-proxy');

// Configuration
const configs = vscode.workspace.getConfiguration("vs-browser");
const HOST = "localhost";
const PORT = configs.get<string>("localProxyServer.port") || 9999;

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

proxy.on('proxyRes', function (proxyRes: any, req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Frame-Options', false);
  if (proxyRes.headers['content-type']) {
    res.setHeader('Content-Type', proxyRes.headers['content-type']);
  }

  proxyRes = decompress(proxyRes, proxyRes.headers['content-encoding']);

  var buffer = Buffer.from('', 'utf8');
  proxyRes.on('data', (chunk: any) => (buffer = Buffer.concat([buffer, chunk])));

  let body: any = null;
  proxyRes.on('end', function () {
    body = buffer.toString('utf8');
    if (res.hasHeader('Content-Type') && res.getHeader('Content-Type').match(/([^;]+)*/g)[0] === 'text/html') {
      let url = req.originalUrl;
      let regex = /(http(|s))\:\/\/([^\/]+)*/g;
      url = url.match(regex)[0];

      // Capture html tag not a|img and add the rest of the string of the tag after src|href="(capture)> to the new string
      body = body.replaceAll(/<((?!a|img).*)(.*?) (src|href)=('|"|)((http(s|)).*?)>/g, '<$1$2 $3=$4http://' + HOST + ':' + PORT + '/$5>');
      body = body.replaceAll(/<(a|img) (.*?)(src|href)=('|"|)\/(.*?)>/g, '<$1 $2$3=$4' + url + '/$5>');
      body = body.replaceAll(/<((?!a|img).*) (.*?)(src|href)=('|"|)\/(.*?)>/g, '<$1 $2$3=$4http://' + HOST + ':' + PORT + '/' + url + '/$5>');
    }
    body = Buffer.from(body, 'utf8');
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
  console.log('Local proxy server started on port ' + PORT);

  // Create the express app
  app.use(morgan('dev'));

  app.use(function (req: any, res: any) {
    let options = {
      target: null,
      ssl: {
        key: fs.readFile(path.resolve(__dirname, "ssl/key.pem"), function read(err: any, data: any) {
        }),
        cert: fs.readFile(path.resolve(__dirname, "ssl/cert.pem"), function read(err: any, data: any) {
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

function decompress(proxyRes: any, contentEncoding: string) {
  let _proxyRes = proxyRes;
  let decompress;

  switch (contentEncoding) {
    case 'gzip':
      decompress = zlib.createGunzip();
      break;
    case 'br':
      decompress = zlib.createBrotliDecompress();
      break;
    case 'deflate':
      decompress = zlib.createInflate();
      break;
    default:
      break;
  }

  if (decompress) {
    _proxyRes.pipe(decompress);
    _proxyRes = decompress;
  }

  return _proxyRes;
}