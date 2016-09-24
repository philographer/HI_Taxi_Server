/**
 * Created by yuhogyun on 2016. 9. 24..
 */
var config = require('../../config.js');
var api_key = config.MAILGUN_API_KEY;
var domain = config.DOMAIN_URL;

function mailService(){

}

/* parameter
 var data = {
 from: 'Excited User <me@samples.mailgun.org>',
 to: 'serobnic@mail.ru',
 subject: 'Hello',
 text: 'Testing some Mailgun awesomness!'
 };
 */

mailService.prototype.sendMail = function(data){
    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });
};


module.exports = mailService;
