'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RawSchema = new Schema({
    url: {type: String},
    category: {type: String},
    data: {type: String},
    updatedAt: {type: Date}                  // 修改时间
}, {capped: {size: 1048576, max: 100000, autoIndexId: true}});

module.exports = RawSchema;