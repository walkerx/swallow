'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CharacterSchema = new Schema({
    account: {},
    hashed_password: {type: String},
    nickname: {type: String, require: true},
    avatar: {type: String},
    phone: {type: String},
    profile: {
        name: {type: String},
        age: {type: Number},
        sex: {type: Number}
    },
    tags: [],
    status: {type: Number},                     // 0 不可见  1 可见  2 删除
    updatedAt: {type: Date},                   // 修改时间
    createdAt: {type: Date}                    // 创建时间
}, {autoIndex: false});

// mongoose.model('Character', CharacterSchema);
// module.exports = mongoose.model('Character');
module.exports = CharacterSchema;
