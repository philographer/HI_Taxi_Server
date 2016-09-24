/**
 * Created by yuhogyun on 2016. 9. 24..
 */
var app = require('../app');
var express = require('express');
var router = express.Router();
var request = require('request');

//Internal controller
var UserController = require('../lib/controller/signupController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', UserController.signUpUser);



module.exports = router;

