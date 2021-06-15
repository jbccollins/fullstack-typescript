import nodemailer, { SentMessageInfo } from 'nodemailer';

const forgotPasswordEmailBodyTemplate = `
  <div>
    Reset your password:
    <a href="http://localhost:3000/change-password/[token]">Reset Password</a>
  </div>
`;

const changePasswordSuccess = `
  <div>
    Your password has been changed successfully
  </div>
`;

const formatEmailTemplate = (args: { [key: string]: string | number }, template: string): string => {
  let body = template;
  Object.entries(args).forEach(([key, value]) => {
    body = body.replace(`[${key}]`, String(value));
  });
  return body;
};

async function sendEmail(to: string, html: string): Promise<void> {
  // Find your credentials here: https://app.mailgun.com/app/sending/domains
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILGUN_USERNAME,
      pass: process.env.MAILGUN_PASSWORD,
    },
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
  const info = await transporter.sendMail({
    from: 'noreply@fullstacktypescript.com', // sender address
    to, // list of receivers
    subject: 'Hello', // Subject line
    //text: text, // plain text body
    html,
  });

  console.log('Message sent: %s', info.messageId);
}

export default sendEmail;
export { forgotPasswordEmailBodyTemplate, formatEmailTemplate, changePasswordSuccess };
