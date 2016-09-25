/**
 * Created by yuhogyun on 2016. 9. 25..
 */

const Config = require('./../../config');
const DbService = require('./../service/dbService');
var dbService = new DbService({dbName: Config.DB_NAME,
    dbLogging: Config.DB_LOGGING,
    dbUsername: Config.DB_USERNAME,
    dbPassword: Config.DB_PASSWORD,
    hostName: Config.DB_HOST_NAME});

exports.createRoom = function(req, res){
    var subwaynum = req.body['subwaynum'];
    var host = req.body['host'];
    var title = req.body['title'];

    dbService.createRoom(subwaynum, host, title).then(function(result){
        res.status(200).json({message: "방 만들기 성공"});
    }).catch(function(error){
        res.status(500).json({message: error.message});
    });
};

exports.showRoom = function(req, res){
    dbService.readRoom().then(function(result){
        res.status(200).json(result)
    }).catch(function(error){
        res.status(500).json({message: error.message});
    });
};
