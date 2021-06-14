import nodemailer from "nodemailer";

async function sendEmail(to: string, html: string) {
  // Find your credentials here: https://app.mailgun.com/app/sending/domains
  const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILGUN_USERNAME,
      pass: process.env.MAILGUN_PASSWORD,
    }
  });

  // Gmail is obnoxious about this: https://community.nodemailer.com/using-gmail/
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: process.env.EMAIL_ADDRESS,
  //     pass: process.env.EMAIL_PASSWORD,
  //   }
  // });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'noreply@fullstacktypescript.com', // sender address
    to, // list of receivers
    subject: "Hello", // Subject line
    //text: text, // plain text body
    html
  });

  console.log("Message sent: %s", info.messageId);
}

export default sendEmail;