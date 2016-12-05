'use strict';

let Redis = require('./redis/index');
let Mongo = require('./mongo/index');

class Store {
    constructor() {
    }

    config(mongo, redis) {
        this.Redis = Redis(redis);
        this.Mongo = Mongo(mongo);
    }
}

module.exports = new Store();