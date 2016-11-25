'use strict';


class Message {
    constructor(opt){
        this.id = opt.id;
        this.type = opt.type;
        this.payload = opt.payload;
    }


}

module.exports = Message;