'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let QueueSchema = new Schema({
    name: {type: String},
    category: {type: String},
    message: {},
    updatedAt: {type: Date}                  // 修改时间
}, {capped: {size: 1024, max: 10000, autoIndexId: true}});

module.exports = QueueSchema;