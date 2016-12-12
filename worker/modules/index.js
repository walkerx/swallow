'use strict';

let modules = function () {
    return {
        init: function (conf) {
            conf.forEach((module) => {
                this[module] = require(__dirname + '/' + module);
            });
        }
    }
};

module.exports = modules();