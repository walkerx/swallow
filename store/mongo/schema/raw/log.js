'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
    text: {type: String},
    updatedAt: {type: Date}                  // 修改时间
}, {capped: {size: 1024, max: 1000, autoIndexId: true}});

// mongoose.model('Log', LogSchema);
// module.exports = mongoose.model('Log');
module.exports = LogSchema;