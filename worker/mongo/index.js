'use strict';
let mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
mongoose.Promise = require('bluebird');
let utils = require($ROOT + '/lib/utils');

let Mongo = function () {
    //let instance = {};
    return {
        config: function(conf){
            let raw = conf.mongo.raw;
            let self = this;
            self.connections = [];
            let uri = 'mongodb://' + raw.host + ':' + raw.port + '/' + raw.db;
            let tailable = mongoose.createConnection(uri, {
                db: {native_parser: true},
                server: {poolSize: 1}
            });
            tailable.on('error', console.error.bind(console, 'tailable connection error:'));
            tailable.once('open', () => {
                console.log('tailable db is open');
            });
            let info = utils.getInfo(__dirname + '/schema/');
            info.forEach(function (item) {
                let modelName = item.fileName.replace(/(\w)/, function (v) {
                    return v.toUpperCase()
                });
                self[modelName]  =  tailable.model(modelName, require(item.path));
                //instance[modelName] = connection.model(modelName, require(item.path));
            });

            uri = 'mongodb://' + raw.host + ':' + raw.port + '/' + raw.db;
            let connection = mongoose.createConnection(uri, {
                db: {native_parser: true},
                server: {poolSize: 5}
            });
            connection.on('error', console.error.bind(console, 'connection error:'));
            connection.once('open', () => {
                console.log('db is open');
            });
            conf.modules.forEach((module) => {
            // for (let module in conf.modules) {
                let info = utils.getInfo(__dirname + '/' + module);
                info.forEach(function (item) {
                    let modelName = item.fileName.replace(/(\w)/, function (v) {
                        return v.toUpperCase()
                    });
                    self[modelName] = connection.model(modelName, require(item.path));
                });
            });
            self.connections.push(connection);
            self.connections.push(tailable);
            //mongoose.set('debug', true);
        }
    }
};

module.exports = Mongo();