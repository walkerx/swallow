'use strict';

var express = require('express');
var kraken = require('kraken-js');

var myClass = require('./lib/myClass'),
    validator = require('./lib/validator')(),
    store = require('./store');

global.$ClientError = myClass.ClientError;
var options, app;

options = {
    onconfig: function (config, next) {
        store.config(config.get('mongo'), config.get('redis'));
        next(null, config);
    }
};

app = module.exports = express();
app.use(kraken(options));
app.set('etag', false);
app.on('start', function () {
    require('./modules/crawler');
    console.log('on start');
});
app.on('middleware:before:session', function (eventargs) {
    app.use(validator);
});
app.on('middleware:after:session', function (eventargs) {});
