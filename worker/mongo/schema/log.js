'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LogSchema = new Schema({
    app: {type: String},
    text: {type: String},
    updatedAt: {type: Date, default: Date.now }                  // 修改时间
}, {capped: {size: 32768, max: 10000, autoIndexId: true}});

module.exports = LogSchema;