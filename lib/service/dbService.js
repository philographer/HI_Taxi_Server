/**
 * Created by yuhogyun on 2016. 9. 24..
 */

var Sequelize = require('sequelize');
var Q = require('q');
var request = require('request');

const DbModel = require('./dbModel');
const mailService = require('mailService');

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
        return that._sendMail(email);
    }).then(function(res){

    }).catch(function(err){
        console.log(err);
        deferred.reject(new Error(err));
    });
    return deferred.promise;
};

DbService.prototype._sendMail = function(email){
    var deferred = Q.defer();

    mailService.sendMail(email).then(function(res){
       deferred.resolve(res);
    }).catch(function(error){
        deferred.resolve(error);
    });

    return deferred.promise;
};

DbService.prototype.hello = function(){
    console.log("할로");
};


DbService.prototype.sync = function (){
    this.sequelize.sync();
};

module.exports = DbService;
