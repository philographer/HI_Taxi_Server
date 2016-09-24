/**
 * Created by yuhogyun on 2016. 9. 24..
 */

const Config = require('./../../config');
const DbService = require('./../service/dbService');
var dbService = new DbService({dbName: Config.DB_NAME,
    dbLogging: Config.DB_LOGGING,
    dbUsername: Config.DB_USERNAME,
    dbPassword: Config.DB_PASSWORD,
    hostName: Config.DB_HOST_NAME});


exports.emailVerification = function(req, res){
    var token = req.query.token.toString();

    dbService.mailVerification(token).then(function(){
        console.log("성공");
        res.status(200).json({message: "이메일 인증이 완료되었습니다."});
    }).catch(function(error){
        console.log(error);
        res.status(500).json({message: error.message});
    });
};
