'use strict';

var fs = require('fs');

//获取客户端IP
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.ip ||
        req._remoteAddress ||
        (req.connection && req.connection.remoteAddress) ||
        undefined;
}

function getInfo(dir, info) {
    info = info || [];
    fs.readdirSync(dir).forEach(file => {
        let fName = dir + '/' + file;
        if (fs.lstatSync(fName).isDirectory()) {
            return getInfo(fName, info);
        }
        if (file.indexOf('.js') > -1) {
            info.push({fileName: file.split('.')[0], path: fName});
        }
    });
    return info;
}

module.exports = {
    getInfo: getInfo,  //获取目录下的所有文件路径
    getClientIp: getClientIp,  //获取客服端IP
};
