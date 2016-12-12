'use strict';

global.$ROOT = __dirname;
let workerId = process.env.NODE_APP_INSTANCE;
//let workerId = 1;
let conf = require('./config.json');
let Mongo = require('./mongo');
let Modules = require('./modules');

Mongo.config(conf);
Modules.init(conf.modules);

let errLog = function(err){
    Mongo.Log.create({app: 'worker:' + workerId, text: err.message}, function(err, doc){
        if(err){
            console.log(err.message);
        }
        process.exit();
    });
};

let saveRaw = function(result, data){
    Mongo.Raw.create({workerId: workerId, module: data.module, dataType: data.dataType, data: result}).exec(function(err){
        if(err){
            console.error(err.message);
        }
    });
};

let cursor = Mongo.Queue.find({workerId: workerId}).lean(true).tailable(true, {awaitdata: true, timeout: false}).cursor();

//data   module模块名称   任务名称
cursor.on('data', function (data) {
    if(!data.module){
        console.error('error: data.module not exist');
    }
    Modules[data.module][data.name].run(data.message);
});

cursor.on('end', function () {
    console.log('end');
    process.exit();
});

cursor.on('error', errLog);