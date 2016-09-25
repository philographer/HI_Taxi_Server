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
        time: Sequelize.TIME,
        name: Sequelize.STRING,
        express: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
        holiday: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}
    });

    this.models['room'] = sequelize.define('room', {
        subwaynum: Sequelize.STRING, //방 열차번호로 구분함.
        host: Sequelize.STRING, //방장 이름
        title: Sequelize.STRING, //방제목
        now: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0}, //현재 인원
        total: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 4}, //몇명 구할건지
        participant: { type: Sequelize.ARRAY(Sequelize.JSON), allowNull: false, defaultValue: []}
    });

    return models;
}

module.exports = DbModel;

