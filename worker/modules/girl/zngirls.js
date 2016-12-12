'use strict';

let request = require('request-promise');
let cheerio = require('cheerio');
let upload = require($ROOT + '/base/qiniu');
let async = require('async');
let Mongo = require($ROOT + '/mongo');
let iSiteId = 2;
let baseUrl = 'http://www.zngirls.com/';
let options = {
    headers: {
        'User-Agent': 'request',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6'
    },
    transform: function (body, response, resolveWithFullResponse) {
        return cheerio.load(body);
    }
};

let getAlbumsPerPage = function (next) {
    return function ($) {
        async.mapLimit($('img', 'span.ck-icon'), 10, (element, cb) => {
            let data = {};
            data.name = $(element).attr('alt');
            data.cover = $(element).attr('src');
            data.albumId = data.cover.split('/')[5];
            data.meta = {
                girlId: data.cover.split('/')[4]
            };
            //data.albumId =  $(element.parent).attr('href').split('/')[4].split('.')[0];
            // data.tag = category.iTags;
            data.status = 0;
            data.iSiteId = iSiteId;
            data.url = 'http://www.zngirls.com/g/' + data.albumId + '/';
            options.url = data.url;
            request(options).then(($$) => {
                data.picNum = $$('span', '#dinfo').text().match(/\d+/g)[0];
                data.tag = [];
                $$('a', '#utag').each((i, a) => {
                    data.tag[i] = $$(a).text();
                });
                //data.picBaseUrl = $$('img','#hgallery').first().attr('src');
                data.update_at = Date.now();
                Mongo.GirlAlbum.update({iSiteId: iSiteId, albumId: data.albumId}, data, {upsert: true}, cb);
            }).catch((err) => {
                cb(err);
            });
        }, next);
    };
};


let getTotalPage = function () {
    options.url = 'http://m.zngirls.com/gallery/';
    return request(options).then(($) => {
        return $('span.page', '#pagediv').text().match(/\d+/g)[1];
    })
};

let fetch = function () {
    getTotalPage().then((count) => {
        console.log(count);
        async.timesLimit(638 - 560, 5, (n, next) => {
            n = n + 560;
            if (n === 1) {
                options.url = 'http://m.zngirls.com/gallery/';
            } else {
                options.url = 'http://m.zngirls.com/gallery/' + n + '.html';
            }
            request(options).then(getAlbumsPerPage(function(err, result){
                if(err){
                    console.log('error:' + n);
                    next(err, result);
                }
                console.log('finish:' + n);
                next(null, result);
            }));
        }, function (err, result) {
            if (err) {
                console.error(err);
            }
            console.log(result);
        })
    }).catch((err) => {
        console.error(err);
    });
};

let toQiNiu = function (category) {
    Mongo.GirlAlbum.find({iSiteId: iSiteId, tag: category, status: 0}).lean(true).then((albums) => {
        let list = albums.map((album) => {
            return function (cb) {
                async.timesLimit(album.picNum, 5, (n, next) => {
                    n = n + 1;
                    let id = album.albumId;
                    if (album.albumId.length === 1) {
                        id = '0' + album.albumId;
                    }
                    options.url = 'http://img1.mm131.com/pic/' + id + '/' + n + '.jpg';
                    upload(request(options.url), album.albumId + '_' + n + '.jpg', next);
                }, function (err, result) {
                    Mongo.GirlAlbum.update({iSiteId: iSiteId, albumId: album.albumId}, {status: 4}, cb);
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
            fetch();
            break;
        case 'toQiNiu':
            toQiNiu(message.category);
            break;
    }
};

module.exports = {
    run: run
};
