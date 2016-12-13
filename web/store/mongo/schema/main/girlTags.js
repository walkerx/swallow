'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GirlTagsSchema = new Schema({
    name: {type: String, require: true},        // 标签名称
    eName: {type: String},
    children: [{type: String}],                 //子标签名
    albumNum: {type: Number, default: 0},       //该专辑的贴士数量
    grade: {type: Number, default: 1, require: true}, //标签层级 从1开始
    sort: {type: Number},                       // 排序值,越大越靠前
    status: {type: Number},                     // 0 不可见  1 可见  2 删除
    updated_at: {type: Date},                   // 修改时间
    created_at: {type: Date}                    // 创建时间
}, {autoIndex: false});

module.exports = GirlTagsSchema;