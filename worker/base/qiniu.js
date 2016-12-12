'use strict';
let qiniu = require("qiniu");

qiniu.conf.ACCESS_KEY = 'ZGuhG9J-fV6UvOJO_hZ4obNC-CAY4K_EkR8OLtHC';
qiniu.conf.SECRET_KEY = '1z6FK0JMzjKZqQBRfA0Lttd3Ea0dO6K8VHF08RXh';

let bucket = 'iosthermal';

//key = 'my-nodejs-logo.png';

function uptoken(bucket, key) {
    let putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPolicy.token();
}

let upload = function (rs, key, cb) {
    let extra = new qiniu.io.PutExtra();
    let token = uptoken(bucket, key);
    qiniu.io.putReadable(token, key, rs, extra, cb);
};

module.exports = upload;


// function(err, ret) {
//     if(!err) {
//         // 上传成功， 处理返回值
//         console.log(ret.hash, ret.key);
//
//     } else {
//         // 上传失败， 处理返回代码
//         console.log(err);
//     }
// }


