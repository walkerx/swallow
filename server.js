'use strict';
global.$ROOT = __dirname;

var app = require('./index'),
    fs = require('fs'),
    //http = require('http'),
    http2 = require('spdy'),
    server;
var privateKey = fs.readFileSync('ssl/ca.key'),
    certificate = fs.readFileSync('ssl/ca.crt'),
    credentials = {key: privateKey, cert: certificate};

server = http2.createServer(credentials, app);
server.listen(process.env.PORT || 8000);
server.on('listening', function () {
    var date = new Date();
    console.log('%s [%s] Listening on http://localhost:%d', date, app.settings.env, this.address().port);
});
