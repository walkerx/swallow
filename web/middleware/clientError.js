'use strict';

module.exports = function () {
    return (err, req, res, next) => {
        if (err.name === 'ClientError') {
            res.status(200);
            return res.json({result: 2, error: err.message});
        } else {
            next(err);
        }
    };
};
