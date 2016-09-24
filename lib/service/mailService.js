/**
 * Created by yuhogyun on 2016. 9. 24..
 */
var config = require('../../config.js');
var api_key = config.MAILGUN_API_KEY;
var domain = config.DOMAIN_URL;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var Q = require('q');

exports.sendMail = function(email, token){
    var deferred = Q.defer();
    var data = {
        from: config.MAIL_FROM,
        to: email,
        subject: config.MAIL_SUBJECT,
        html: config.MAIL_TEXT + '<br>'+ "<a href=\'"+config.SERVER_HOST_NAME + "/verification?token="+ token + "\'>" + "click here" + "</a>"
    };

    mailgun.messages().send(data, function (error, body) {
        deferred.resolve(body);
        console.log(body);
        console.log(data.html);
    });
    return deferred.promise;
};

/* parameter
 var data = {
 from: 'Excited User <me@samples.mailgun.org>',
 to: 'serobnic@mail.ru',
 subject: 'Hello',
 text: 'Testing some Mailgun awesomness!'
 };
 */


