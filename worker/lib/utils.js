'use strict';

let fs = require('fs');

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
};
