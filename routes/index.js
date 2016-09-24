/**
 * Created by yuhogyun on 2016. 9. 24..
 */
var app = require('../app');
var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/hello', function(req, res){
  app.dbService.createUser(req.body['facebookId'], req.body['username']).then(function(){
    res.status(200).json({message: "회원가입 성공"});
  }).catch(function(error){
    console.log(error.message);
  });

  app.dbService.hello();

});

module.exports = router;

