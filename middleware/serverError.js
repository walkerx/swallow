'use strict';

module.exports = function () {
    return (err, req, res, next) => {
        //db.Log.insert()
        if (!res.finished) {
            res.status(500);
            return res.json({result: 0});
        }
    };
};
