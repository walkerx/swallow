'use strict';
let mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
mongoose.Promise = require('bluebird');
let utils = require($ROOT + '/lib/utils');

let mongo = function (conf) {
    let instance = {};
    let uri = 'mongodb://' + conf.host + ':' + conf.port + '/' + conf.db;
    let connection = mongoose.createConnection(uri, {
        db: {native_parser: true},
        server: {poolSize: 3}
    });
    connection.on('error', console.error.bind(console, 'connection error:'));
    connection.once('open', () => {
        console.log('db is open');
    });
    let info = utils.getInfo(__dirname + '/schema/');
    info.forEach(function (item) {
        let modelName = item.fileName.replace(/(\w)/, function (v) {
            return v.toUpperCase()
        });
        instance[modelName] = connection.model(modelName, require(item.path));
    });
    instance.connection = connection;
    //mongoose.set('debug', true);
    return instance;
};

module.exports = mongo;