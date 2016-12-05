'use strict';
let conf = require('./config.json');
let Job = require('../common/job');
var request = require('request-promise');

class qqClub  {
    constructor(){
        //super();
        this.catgeries = conf.category;
        // this.catgeries.forEach((category) => {
        //     category.refer = 'http://buluo.qq.com/p/category.html?cateid=' + category.cateid;
        //     category.cateUrl = 'http://buluo.qq.com/cgi-bin/bar/get_bar_list_by_category?gflag=1&sflag=0&n=60&s=0&cateid=' + category.cateid;
        //     category.bidUrls = [];
        //     category.bids.forEach((bid) => {
        //         let bidUrl = 'http://buluo.qq.com/cgi-bin/bar/post/get_post_by_page?bid=' + bid + '&num=60&start=0';
        //         category.bidUrls.add(bidUrl);
        //     })
        // });
    }

    doJob(message){

        switch (message[1]){
            case 'fetchPosts':
                let num = 20, start = 0;
                this.getPosts(message[2], num, start);
                break;
            default:
                break;
        }
    }

    getPosts(bid, size, offset) {
        let params = {
            method: 'GET',
            qs: {
                bid: bid,
                num: size,
                start: offset
            },
            uri: 'http://buluo.qq.com/cgi-bin/bar/post/get_post_by_page',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'http://buluo.qq.com/p/barindex.html?bid=' + bid
            },
            json: true
        };
        let num = 0;
        request(params).then((res) => {
            if(res.result && res.result.total > 0) {
                num = res.result.postnum;
                return {
                    request: params,
                    category: bid,
                    data: JSON.stringify(res)
                };
            }
        }).then((raw) => {
            return Mongo.Raw.create(raw);
        }).then((raw) => {
            this.getPosts(bid, size, offset + num)
        }).catch((err) => {
            console.error(err.toString());
        });
    }
}

module.exports = new qqClub();