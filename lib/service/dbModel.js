/**
 * Created by yuhogyun on 2016. 7. 18..
 */

var Sequelize = require('sequelize');
var Q = require('q');

function DbModel(sequelize){
    this.models = {};
    this.models['user'] = sequelize.define('user', {
        email: Sequelize.STRING,
        name: Sequelize.STRING,
        gender: Sequelize.ENUM('male', 'female')
    });

    return models;
}

module.exports = DbModel;

