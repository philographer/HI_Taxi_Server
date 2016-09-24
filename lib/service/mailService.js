/**
 * Created by yuhogyun on 2016. 9. 24..
 */
var config = require('../../config.js');
var api_key = config.MAILGUN_API_KEY;
var domain = config.DOMAIN_URL;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var Q = require('q');

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

mailService.prototype.sendMail = function(email){
    var deferred = Q.defer();
    var data = {
        from: 'Excited User <me@samples.mailgun.org>',
        to: email,
        subject: 'Hi Taxi Validation',
        text: 'Testing some mail awesomness!'
    };

    mailgun.messages().send(data, function (error, body) {
        deferred.resolve(body);
        console.log(body);
    });
    return deferred.promise;
};


module.exports = mailService;
