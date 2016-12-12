'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let QueueSchema = new Schema({
    name: {type: String},
    workerId: {type: Number},
    module: {type: String},
    message: {},
    updatedAt: {type: Date}                  // 修改时间
}, {capped: {size: 1024, max: 10000, autoIndexId: true}});

module.exports = QueueSchema;