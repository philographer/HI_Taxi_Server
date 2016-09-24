/**
 * Created by yuhogyun on 2016. 9. 24..
 */

var Sequelize = require('sequelize');
var Q = require('q');
var request = require('request');
var randomstring = require('randomstring');
var CryptoJS = require('crypto-js');
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


DbService.prototype.createUser = function(name, gender, email){
    var deferred = Q.defer();
    var that = this;
    this.model['user'].create({name: name, gender: gender, email: email}).then(function(){
        return that._createVerification(email);
    }).then(function(token) {
        return that._sendMail(email, token.toString());
    }).then(function(res){
        deferred.resolve();
    }).catch(function(err){
        deferred.reject(new Error(err));
    });
    return deferred.promise;
};

DbService.prototype._sendMail = function(email, token){
    var deferred = Q.defer();

    mailService.sendMail(email, token).then(function(res){
       deferred.resolve(res);
    }).catch(function(error){
        deferred.resolve(error);
    });

    return deferred.promise;
};

DbService.prototype._createVerification = function(email){
    var deferred = Q.defer();
    var input = email;
    var token = CryptoJS.AES.encrypt(input,config.SECRET).toString();
    token.replace("+", "");
    token.replace("'", "");

    this.model['verification'].create({email: email, verification_code: token}).then(function(){
        deferred.resolve(token);
    }).catch(function(error){
        deferred.reject(error);
    });

    return deferred.promise;
};


DbService.prototype.mailVerification=function (token) {
    var deferred = Q.defer();

    this.model['verification'].find({where:{verification_code: token}}).then(function (res) {
        if(res){
            deferred.resolve("이메일 인증 성공");
        }else{
            deferred.reject(new Error("이메일 인증 실패"));
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
