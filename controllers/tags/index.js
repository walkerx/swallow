'use strict';

let db = require($ROOT + '/store/').Mongo;

let list = function (req, res, next) {
    let offset = parseInt(req.query.offset);
    let size = parseInt(req.query.size);
    if (isNaN(offset) || isNaN(size) || offset < 0 || size < 0 || size > 40) {
        throw new $ClientError('参数错误');
    }
    db.Tag.find().skip(offset).limit(size).lean().then((tags) => {
        return res.json({result: 1, data: tags});
    }).catch(err => next(err));
};

let create = (req, res, next) => {

};


module.exports = function (router) {

    //获取标签列表
    router.get('/create', create);
    router.get('/', list);
};
