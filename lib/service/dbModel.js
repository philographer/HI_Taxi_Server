/**
 * Created by yuhogyun on 2016. 7. 18..
 */

var Sequelize = require('sequelize');
var Q = require('q');

function DbModel(sequelize){
    this.models = {};
    this.models['user'] = sequelize.define('user', {
        email: {type : Sequelize.STRING,unique: true},
        name: Sequelize.STRING,
        gender: Sequelize.ENUM('male', 'female'),
        verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
        imei: {type : Sequelize.STRING,unique: true}
    });

    this.models['verification']=sequelize.define('verification',{
        email: Sequelize.STRING,
        verification_code : Sequelize.STRING
    });

    this.models['station'] = sequelize.define('station', {
        station: Sequelize.STRING,
        time: Sequelize.STRING,
        name: Sequelize.STRING,
        express: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
        holiday: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}
    });

    return models;
}

module.exports = DbModel;

