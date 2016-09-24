/**
 * Created by pck37 on 2016-09-24.
 */

const Config = require('./../../config');
const DbService = require('./../service/dbService');
var dbService = new DbService({dbName: Config.DB_NAME,
    dbLogging: Config.DB_LOGGING,
    dbUsername: Config.DB_USERNAME,
    dbPassword: Config.DB_PASSWORD,
    hostName: Config.DB_HOST_NAME});


exports.imeiLogin = function(req, res){
    var imei = req.body['imei'];
    console.log(imei);
    dbService.validimei(imei).then(function(result){
        console.log("로그인성공");
        res.status(200).json({message: result});
    }).catch(function(error){
        console.log(error);
        res.status(500).json({message: error.message});
    });
};