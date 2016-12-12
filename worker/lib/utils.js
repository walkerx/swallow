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


function getPath(dir, paths) {
    if (!paths) {
        paths = [];
    }
    let files = fs.readdirSync(dir);
    for (let file in files) {
        let fName = dir + '/' + files[file];
        let stat = fs.lstatSync(fName);
        if (stat.isDirectory() === true) {
            getPath(fName, paths);
        } else {
            if (files[file].indexOf('.js') > -1) {
                paths.push(fName);
            }
        }
    }
    return paths;
}


module.exports = {
    getPath: getPath,
    getInfo: getInfo,  //获取目录下的所有文件路径
};
