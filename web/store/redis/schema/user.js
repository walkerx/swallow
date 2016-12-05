'use strict';

let User = function (client) {
    return {
        prefix: 'user:',
        keyString: 'user:id:',
        hashExpire: 60 * 60 * 24 * 3,

        setHash: function (userId, userObj, callback) {
            client.hmset(this.keyString + userId, userObj, callback);
        }
    }
};

module.exports = User;
