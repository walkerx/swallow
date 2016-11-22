'use strict';
let sub = require($ROOT + './store').Redis.sub;
let pm2= Promise.promisifyAll(require('pm2'));
// let pm2 = require('pm2');

let manager = function(){
    sub.subscribe('schedule').then((res) => {
        console.log('subscribe schedule ok. sub num:' + res);
    }).catch((err) => {
        console.error('subscribe schedule error:' + JSON.stringify(err));
    });

    sub.on('message', function (channel, message) {
        switch (channel) {
            case 'schedule':
                break;
            default:
                console.log('Receive message %s from channel %s', message, channel);
                break;
        }
    });

    pm2.connect().then(pm2.launchBus())
    pm2.list(function(err, res){

    });

    pm2.sendDataToProcessId

    return {
        sub: sub
    }
};


module.exports = manager;
