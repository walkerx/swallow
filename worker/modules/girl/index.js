'use strict';
let conf = require('./config.json');

let Girl = function(){
    let jobs = {};
    conf.jobs.forEach((job) => {
         jobs[job] = require('./' + job);
    });
    return jobs;
};

module.exports = Girl();