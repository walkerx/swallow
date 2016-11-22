'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RawSchema = new Schema({
    url: {type: String},
    category: {type: String},
    data: {type: String},
    updatedAt: {type: Date}                  // 修改时间
}, {capped: {size: 1024, max: 1000, autoIndexId: true}});

module.exports = RawSchema;