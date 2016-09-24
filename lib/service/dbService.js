/**
 * Created by yuhogyun on 2016. 9. 24..
 */

var Sequelize = require('sequelize');
var Q = require('q');
var request = require('request');

const DbModel = require('./dbModel');

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


DbService.prototype.createUser = function(facecbookId, username){
    var deferred = Q.defer();
    this.model['user'].create({facebookId: facecbookId, username: username}).then(function(){
        deferred.resolve();
    }).catch(function(err){
        console.log(err);
        deferred.reject(new Error(err));
    });
    return deferred.promise;
};

DbService.prototype.hello = function(){
    console.log("할로");
}


DbService.prototype.sync = function (){
    this.sequelize.sync();
};

module.exports = DbService;
