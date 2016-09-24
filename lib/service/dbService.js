/**
 * Created by yuhogyun on 2016. 9. 24..
 */

var Sequelize = require('sequelize');
var Q = require('q');
var request = require('request');
var randomstring = require('randomstring');
var crypto = require('crypto');
var config = require('../../config');


const DbModel = require('./dbModel');
const mailService = require('./mailService');

function DbService (configObj) {
    this.dbName = configObj['dbName'];
    this.dbUsername = configObj['dbUsername'];
    this.dbPassword = configObj['dbPassword'];

    this.sequelize = new Sequelize(this.dbName ,this.dbUsername, this.dbPassword = configObj['dbPassword'],{
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
    this.model['user'].create({name: name, gender: gender, email: email, imei: imei}).then(function(){
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
}
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
    var that = this

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
DbService.prototype.sync = function (){
    this.sequelize.sync();
};

module.exports = DbService;
