'use strict';
const EventEmitter = require('events');

class Queue extends EventEmitter {
    constructor(channel, client) {
        super();
        this.name = channel;
        this.client = client;
        let self = this;
        self.ready = false;
        this.client.subscribe(channel).then((count) => {
            console.log(count);
            self.ready = true;
            self.emit('ready');
        }).catch((err) => {
            console.error(JSON.stringify(err));
            throw err;
        });
    }

    onMessage(cb) {
        this.client.on('message', cb);
    }


}

module.exports = Queue;