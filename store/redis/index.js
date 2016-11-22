'use strict';
let Redis = require('ioredis');
let utils = require($ROOT + '/lib/utils');

let create = function(conf){
    let client = new Redis({
        port: conf.port,          // Redis port
        host: conf.host,   // Redis host
        db: conf.db,
        dropBufferSupport: true
    });
    client.on('error', function (err) {
        console.error("error:" + err);
    });
    client.on('connect', function () {
        console.log('redis connect');
    });
    client.on('ready', function () {
        console.log('client ready');
    });
    return client;
};

let redis = function (conf) {
    let instance = {
        sub: create(conf),
        client: create(conf)
    };
    // require(__dirname + '/channel')(instance.sub, conf['subscriber'].channels);
    let info = utils.getInfo(__dirname + '/schema/');
    info.forEach(function (item) {
        instance[item.fileName] = require(item.path)(instance.client);
    });
    return instance;
};

module.exports = redis;