'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
    nickname: {type: String, require: true},        // 宝宝名称
    birthday: {type: Date},
    status: {type: Number},                     // 0 不可见  1 可见  2 删除
    updatedAt: {type: Date},                   // 修改时间
    createdAt: {type: Date}                    // 创建时间
}, {autoIndex: false});

// mongoose.model('Tag', TagSchema);
// module.exports = mongoose.model('Tag');
module.exports = TagSchema;