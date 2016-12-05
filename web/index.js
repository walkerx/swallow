'use strict';

let express = require('express');
let kraken = require('kraken-js');

let myClass = require('./lib/myClass'),
    validator = require('./lib/validator')(),
    store = require('./store');

global.$ClientError = myClass.ClientError;
let options, app;

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
    console.log('on start');
});
app.on('middleware:before:session', function (eventargs) {
    app.use(validator);
});
app.on('middleware:after:session', function (eventargs) {});
