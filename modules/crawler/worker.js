'use strict';

let channel = 'worker:channels:' + process.env.NODE_APP_INSTANCE;
let Redis = require('ioredis');
let client = new Redis();

client.subscribe(channel).then((count) => {
    console.log('ready');
}).catch((err) => {
    console.error(JSON.stringify(err));
});

client.on('message').then((channel, message) => {
    console.log(channel);
    console.log(message);
}).catch((err) => {
    console.error(JSON.stringify(err));
});