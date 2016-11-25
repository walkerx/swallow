'use strict';
let sub = require($ROOT + './store').Redis.sub;
let pub = require($ROOT + './store').Redis.client;

let manager = function(){
    let keyName = '__keyevent@0__:expired';
    sub.subscribe(keyName).then((channel, message) => {
        if(message.)
    }).catch((err) => {
        console.error('subscribe schedule error:' + JSON.stringify(err));
    });

    sub.on('message', function (channel, message) {
        pub.publish()
    });


    return {
        pub: pub,
        sub: sub
    }
};


module.exports = manager;
