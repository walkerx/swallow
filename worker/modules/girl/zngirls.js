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
        // 'Referer': 'http://www.zngirls.com/g/21316/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:50.0) Gecko/20100101 Firefox/50.0'
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
        async.timesLimit(count, 5, (n, next) => {
            n = n + 1;
            if (n === 1) {
                options.url = 'http://m.zngirls.com/gallery/';
            } else {
                options.url = 'http://m.zngirls.com/gallery/' + n + '.html';
            }
            request(options).then(getAlbumsPerPage(function(err, result){
                if(err){
                    console.log('error:' + n);
                    return next(err, result);
                } else {
                    console.log('finish:' + n);
                    return next(null, result);
                }
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

let toQiNiu = function () {
    Mongo.GirlAlbum.find({iSiteId: iSiteId, status: 0}).lean(true).then((albums) => {
        let list = albums.map((album, index) => {
            return function (cb) {
                async.timesLimit(album.picNum - 1, 5, (n, next) => {
                    n = n + 1;
                    let id = album.albumId, picId = '';
                    if (n < 10) {
                        picId = '00' + n;
                    }else if(n < 100 && n >= 10){
                        picId = '0' + n;
                    }
                    options.headers.Referer = 'http://www.zngirls.com/g/' + album.albumId + '/';
                    options.url = 'http://t1.zngirls.com/gallery/' + album.meta.girlId + '/' + id + '/s/' + picId + '.jpg';
                    upload(request(options), 'zn' + iSiteId + '/' +album.meta.girlId + '/' + album.albumId + '_' + n + '.jpg', next);
                }, function (err, result) {
                    if(err) {
                       cb(err);
                    }else {
                        Mongo.GirlAlbum.update({iSiteId: iSiteId, albumId: album.albumId}, {status: 4}, function(err, result){
                            if(err){
                                cb(err);
                            }else{
                                console.log('finish:' + index);
                                cb(null, result);
                            }
                        });
                    }
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

let generateUrl = function(){
    Mongo.GirlAlbum.find({iSiteId: iSiteId, status: 4}).then((albums) => {
        let list = albums.map((album, index) => {
            return function (cb) {
                album.pics = [];
                for (let i = 1; i <= album.picNum - 1; i++) {
                    let url = 'http://7xfd4o.kuiyinapp.com/zn2/' + album.meta.girlId + '/' + album.albumId + '_' + i + '.jpg';
                    album.pics.push(url);
                }
                album.save(function(err, result){
                    if(err){
                       cb(err);
                    }else{
                        cb(null, result);
                    }
                });
            }
        });
        async.parallelLimit(list, 2, function (err, result) {
            if (err) {
                console.error(JSON.stringify(err));
            }
            console.log('finish');
        })
    });
};

let run = function (message) {

    switch (message.cmd) {
        case 'fetch':
            fetch();
            break;
        case 'toQiNiu':
            //toQiNiu();
            generateUrl();
            break;
    }
};

module.exports = {
    run: run
};
