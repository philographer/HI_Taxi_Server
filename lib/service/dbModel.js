/**
 * Created by yuhogyun on 2016. 7. 18..
 */

var Sequelize = require('sequelize');
var Q = require('q');

function DbModel(sequelize){
    this.models = {};
    this.models['user'] = sequelize.define('user', {
        facebookId: Sequelize.STRING,
        username: Sequelize.STRING
    });

    return models;
}

module.exports = DbModel;

