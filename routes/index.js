/**
 * Created by yuhogyun on 2016. 9. 24..
 */
var app = require('../app');
var express = require('express');
var router = express.Router();
var request = require('request');

//Internal controller
var signupController = require('../lib/controller/signupController');
var verificationController = require('../lib/controller/verificationController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', signupController.signUpUser);

router.get('/verification', verificationController.emailVerification);



module.exports = router;

