'use strict';

let Redis = require('./redis');
let Mongo = require('./mongo');

class Store {
    constructor() {
    }

    config(mongo, redis) {
        this.Redis = Redis(redis);
        this.Mongo = Mongo(mongo);
    }
}

module.exports = new Store();