const nodemailer = require("nodemailer"),
  pug = require("pug"),
  { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split("")[0];
    this.url = url;
    this.from = `Natours <${process.env.EMAIL_FROM}>`;
  }

  creatTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async send(template, subject, optionalMsg = "None") {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.creatTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    //uses send method
    await this.send("welcome", "Welcome To The Natours Family!");
    // passes the pug template name to the send method along side the subject line
  }

  async sendPasswordReset(IgnoreMsgOption) {
    await this.send(
      "passwordReset",
      "Your reset password token valid only for 10 minutes",
      IgnoreMsgOption
    );
  }
};
