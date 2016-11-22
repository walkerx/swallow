'use strict';
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var client = require($ROOT + '/store/').Redis.client;

module.exports = function (sessionConfig) {
    sessionConfig.store = new RedisStore({client: client});
    return session(sessionConfig);
};
