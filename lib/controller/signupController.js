/**
 * Created by yuhogyun on 2016. 9. 24..
 */
//Internal dependencies
const Config = require('./../../config');
const DbService = require('./../service/dbService');
var dbService = new DbService({dbName: Config.DB_NAME,
    dbLogging: Config.DB_LOGGING,
    dbUsername: Config.DB_USERNAME,
    dbPassword: Config.DB_PASSWORD,
    hostName: Config.DB_HOST_NAME});




exports.signUpUser = function(req, res){
    console.log(req.body);
    var name = req.body['name'];
    var gender = req.body['gender'];
    var email = req.body['email'];
    var imei = req.body['imei'];

    dbService.createUser(name, gender, email,imei).then(function(){
        res.status(200).json({message: "이메일을 인증해 주세요."});
    }).catch(function(error){
        res.status(500).json({message: error.message});
    });
};

