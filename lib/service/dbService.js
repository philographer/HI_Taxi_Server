/**
 * Created by yuhogyun on 2016. 9. 24..
 */

var Sequelize = require('sequelize');
var Q = require('q');
var request = require('request');
var randomstring = require('randomstring');
var crypto = require('crypto');
var config = require('../../config');
var jsonfile = require('jsonfile');
var moment = require('moment');


const DbModel = require('./dbModel');
const mailService = require('./mailService');

function DbService (configObj) {
    this.dbName = configObj['dbName'];
    this.dbUsername = configObj['dbUsername'];
    this.dbPassword = configObj['dbPassword'];

    this.sequelize = new Sequelize(this.dbName ,this.dbUsername, this.dbPassword,{
        host: configObj['hostName'],
        dialect: 'postgresql',
        port: 5432,
        pool: {
            max: 15,
            min: 0,
            idle: 10000
        }
    });

    this.model = DbModel(this.sequelize);
};

DbService.prototype.getSequelize = function () {
    return this.sequelize;
};


DbService.prototype.createUser = function(name, gender, email,imei){
    var deferred = Q.defer();
    var that = this;

    //찾아보고 있으면
    this.model['user'].findAll({where: {email: email}}).then(function(res){
        console.log("here!!1");
        console.log(res);
        if(res) { //유져가 이미 있으면
            throw "이미 유져가 존재합니다.";
        }else{
            return that._createUser(name, gender, email, imei);
        }
    })
    .then(function(){
        return that._createVerification(email);
    }).then(function(token) {
        return that._sendMail(email, token);
    }).then(function(res) {
        deferred.resolve();
    }).catch(function(err){
        deferred.reject(new Error(err));
    });

    return deferred.promise;
};

DbService.prototype.validimei = function(imei){
    console.log("sadsad");
    var deferred = Q.defer();
    this.model['user'].find({where: {imei: imei}}).then(function (res){
        if(!res){
            console.log("case1");
            deferred.reject(new Error("로그인 실패 : 등록안된 디바이스"));
        }else if(res.verified){
            console.log("case2");
            deferred.resolve("로그인 성공");
        }
        else if(!res.verified){
            console.log("case3");
            deferred.resolve("메일 인증이 필요합니다.");
        }
        else {
            console.log("case4");
            deferred.reject(new Error("???"));
        }
    }).catch(function(error){
        console.log("case5");
        deferred.reject(new Error(error));
        console.log(error);
    });
    return deferred.promise;
};

DbService.prototype._createUser = function(name, gender, email, imei){
    var deffered = Q.defer();

    this.model['user'].create({name: name, gender: gender, email: email, imei: imei}).then(function(res){
        deffered.resolve(res);
    }).catch(function(error){
        deffered.reject(new Error(error));
    });

    return deffered.promise;
};

DbService.prototype._sendMail = function(email, token){
    var deferred = Q.defer();

    mailService.sendMail(email, token).then(function(res){
       deferred.resolve(res);
    }).catch(function(error){
        deferred.reject(new Error(error));
    });

    return deferred.promise;
};

DbService.prototype._createVerification = function(email){
    var deferred = Q.defer();
    var input = email;
    var cipher = crypto.createCipher('aes256',config.SECRET);
    cipher.update(input,'ascii','hex');
    var token = cipher.final('hex');

    this.model['verification'].create({email: email, verification_code: token}).then(function(){
        deferred.resolve(token);
    }).catch(function(error){
        deferred.reject(error);
    });

    return deferred.promise;
};


DbService.prototype.mailVerification=function (token) {
    var deferred = Q.defer();
    var that = this;

    this.model['verification'].find({where:{verification_code: token}}).then(function (res) {
        if(!res){
            deferred.reject(new Error("이메일 인증 실패"));
        }else{
            that.model['user'].update({verified:true}, {where:{email: res.email}})
            deferred.resolve("이메일 인증 성공");
        }
    }).catch(function(error){
        deferred.reject(new Error(error));
        console.log(error);
    });
    return deferred.promise;
};


DbService.prototype.readStation = function(station, express, holiday){
    var that = this;
    var deferred = Q.defer();


    this.model['station'].findOne({where: {station: station, express: express, holiday: holiday}, order: Sequelize.literal('current_time - time'), limit: 1})
        .then(function(result){
            console.log(result.time);
            deferred.resolve(result);
    }).catch(function(error){
        deferred.reject(result);
    });

    return deferred.promise;
};

DbService.prototype.insertData = function(){
    var that = this;
    var rFile = __dirname + '/holiday.json';
    jsonfile.readFile(rFile, function(err, objs){
        jsonfile.spaces = 2;
        //objs = [{json}, {json}...]
        objs['result'].forEach(function(obj, index){
            /* obj = {
            "station": "신도림",
                "K1007": "",
                "K1009": "6:04:30",
                "K1011": "6:23:30",
                "K1013": "6:37:30",
                ...} */
            var this_station = obj['station'];
            for (var i in obj){
                if(i != 'station' && obj[i]){
                    var timeArr = obj[i].split(':');
                    timeArr[0] //시간
                    timeArr[1] //분
                    timeArr[2] //초

                    var now = moment();
                    now.hour(timeArr[0]);
                    now.minute(timeArr[1]);
                    now.second(timeArr[2]);
                    var new_time = now.format();

                    that.model['station'].create({station: this_station, name: i, time: new_time, express: false, holiday: true});
                }
            }
        });
    });
};

DbService.prototype.createRoom = function(subwaynum, host, title, total){
    var deferred = Q.defer();
    var that = this;

    this.model['room'].create({subwaynum: subwaynum, host: host, title: title, total: total}).then(function(result){
        deferred.resolve("방 만들기 성공");
    }).catch(function(error){
        deferred.resolve(new Error("방 만들기 실패" + error));
    });

    return deferred.promise;
};

DbService.prototype.readRoom = function(){
    var deferred = Q.defer();
    var that = this;

    this.model['room'].findAll().then(function(result){
        if (result.length == 0){
            deferred.reject(new Error("방이 존재하지 않습니다."));
        }
        deferred.resolve(result);
    }).catch(function(error){
        deferred.resolve(new Error("방 리스트 불러오기 실패" + error));
    });

    return deferred.promise;
};
DbService.prototype.sync = function (){
    this.sequelize.sync();
};

module.exports = DbService;
