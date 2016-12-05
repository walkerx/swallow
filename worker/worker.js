'use strict';
global.$ROOT = __dirname;
let workerId = pm2_env.NODE_APP_INSTANCE;
let conf = require('./config.json');
let Raw = require('./mongo')(conf.mongo.raw);

let cursor = Raw.Queue.find({workerId: workerId}).lean(true).tailable({awaitdata: true}).cursor();

let errLog = function(err){
    Raw.Log.create({app: 'worker:' + workerId, text: err.message}).exec(function(err){
        if(err){
            console.log(err.message);
        }
    });
};

let saveRaw = function(result, data){
    Raw.Raw.create({workerId: workerId, module: data.module, dataType: data.dataType, data: result}).exec(function(err){
        if(err){
            console.error(err.message);
        }
    });
};

let factory = function(data){

};

cursor.on('data', function (data) {
    //console.log(data);
    if(!data.module){
        console.error('error: data.module not exist');
    }
    let crawler = require('./modules/' + data.module + '/crawler/')(data);
    crawler.run().then(saveRaw).catch(errLog);
});

cursor.on('end', function () {
    console.log('end');
});

cursor.on('error', errLog);

