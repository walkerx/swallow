'use strict';

let sub = function (client, channels) {
    client.subscribe(channels, function(err, count) {
        if(err){
            console.error('sub err:' + JSON.stringify(err));
        }
        console.log('sub num:' + count);
    });
    return client;
};

module.exports = sub;
