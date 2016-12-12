'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GirlAlbumSchema = new Schema({
    iSiteId: {type: Number},        // 自定义的网站id
    albumId: {type: String, index:true},
    meta: {}, //存各个不同站点的信息
    site: {type: String},           // 所属网站url
    name: {type: String},           // 专辑名称
    tag: [{type: String}],          // 专辑标签
    picNum: {type: Number},         // 专辑图片数量
    pics: [{type: String}],         // 专辑图片url列表
    cover: {type: String},          // 专辑封面图
    girl: { type: Schema.ObjectId, ref: 'GirlInfo'},  //关联模特
    url: {type: String},            // 源网站专辑url
    status: {type: Number},         // 0 初始采集数据  1 审核通过并可见  2 审核未通过或者删除  3 审核通过但不可见  4 图片已传7牛
    update_at: {type: Date, default: Date.now}        // 修改时间
}, {autoIndex: false, versionKey: false });

module.exports = GirlAlbumSchema;