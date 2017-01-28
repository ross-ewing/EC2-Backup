var nodemailer = require('nodemailer');

module.exports = function(smtp) {

  var transporter = nodemailer.createTransport(smtp);

  this.Send = function(sender, to, subject, content) {
    var mailOptions = {
        from: sender,
        to: to,
        subject: subject,
        text: content
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
  }

}
