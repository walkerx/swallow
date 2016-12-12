'use strict';

let request = require('request-promise');
let iconv = require('iconv-lite');
let cheerio = require('cheerio');
let upload = require($ROOT + '/base/qiniu');
let async = require('async');
let conf = require('./config.json');
let Mongo = require($ROOT + '/mongo');

let baseUrl= 'http://www.zngirls.com/';
let options = {
    headers: {
        'User-Agent': 'request',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6'
    }
};

let getAlbumsPerPage = function (category, next) {
    return function($){
        async.mapLimit($('img', 'dl.list-left'), 10, (element, cb)=>{
            let data = {};
            data.name = $(element).attr('alt');
            data.cover = $(element).attr('src');
            //data.albumId =  data.cover.split('/')[4];
            data.albumId =  $(element.parent).attr('href').split('/')[4].split('.')[0];
            data.tag = category.iTags;
            data.status = 0;
            data.iSiteId = 1;
            data.url = 'http://m.mm131.com/' + category.ename + '/' +  data.albumId + '.html';
            options.url = data.url;
            request(options).then(($$) => {
                data.picNum = $$('span','div.fenye').text().match(/\d+/g)[1];
                data.update_at = Date.now();
                Mongo.GirlAlbum.update({iSiteId:1, albumId: data.albumId}, data, {upsert: true}, cb);
            }).catch((err)=>{
                console.error(err);
            });
        }, next );
    };
};


let getAlbumsByCategory = function (category, cb) {
    return getTotalPage(category.ename).then((count) => {
        console.log(count);
        async.timesLimit(count, 5, (n, next) => {
            n = n + 1;
            if(n === 1){
                options.url = baseUrl + category.ename;
            }else{
                options.url = baseUrl + category.ename + '/' + 'list_' + category.cateId + '_' + n + '.html';
            }
            request(options).then(getAlbumsPerPage(category, next));
        }, cb)
    });

};

let getTotalPage = function (category) {
    options.url= 'http://m.mm131.com/' + category;
    return request(options).then(($) => {
        return $('#spn').text().match(/\d+/g)[1];
    })
};

let fetch = function (category) {
    let list;
    //if(category === 'all'){
    //     list = conf.mm131.cates.map((cate) => {
    //         return function(cb) {
    //             getAlbumsByCategory(cate, cb);
    //         }
    //     });
    //} else{
    //     list = [
    //         function(cb) {
    //             getAlbumsByCategory(category, cb);
    //         }
    //     ]
    // }
    list = [
        function(cb) {
            getAlbumsByCategory( {"name": "青纯美女", "ename": "qingchun", "cateId": "1", "iTags": ["清纯","热门"],"more":false}, cb);
        }
    ];
    async.series(list, function (err, result) {
        if (err) {
            console.error(JSON.stringify(err));
        }
        console.log('finish');
        //console.log(result);
    })
};

let toQiNiu = function (category) {
    Mongo.GirlAlbum.find({iSiteId:1, tag:category, status:0 }).lean(true).then((albums) => {
        let list = albums.map((album) => {
            return function(cb) {
                async.timesLimit(album.picNum, 5, (n, next) => {
                    n = n + 1;
                    let id = album.albumId;
                    if(album.albumId.length === 1){
                        id = '0' + album.albumId;
                    }
                    options.url = 'http://img1.mm131.com/pic/' + id + '/' + n + '.jpg';
                    upload(request(options.url), album.albumId + '_' + n + '.jpg', next);
                }, function(err, result){
                    Mongo.GirlAlbum.update({iSiteId:1, albumId:album.albumId}, {status: 4}, cb);
                })
            }
        });
        async.parallelLimit(list, 2, function (err, result) {
            if (err) {
                console.error(JSON.stringify(err));
            }
            console.log('finish');
        })
    })
};

let run = function (message) {

    switch (message.cmd) {
        case 'fetch':
            fetch(message.category);
            break;
        case 'toQiNiu':
            toQiNiu(message.category);
            break;
    }
};

module.exports = {
    run: run
};
