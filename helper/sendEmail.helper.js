const nodemailer = require("nodemailer");

module.exports.sendEmail = (emailFrom, emailTo, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailFrom,
      pass: 'vacy wbcw jkxn lpox',
    },
  });

  var mailOption = {
    from: emailFrom,
    to: emailTo,
    subject: subject,
    html: html
  }

  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(info.response);
    }
  });

}