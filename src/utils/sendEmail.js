// const nodemailer = require("nodemailer");
// const createTransporter = require("../config/email");

// const sendEmail = async ({ to, subject, html }) => {
//   const transporter = await createTransporter();

//   const info = await transporter.sendMail({
//     from: '"CraftSite" <no-reply@craftsite.dev>',
//     to,
//     subject,
//     html,
//   });

//   // Ethereal gives you a preview URL — this is how you "see" the email in dev
//   console.log("Preview email at:", nodemailer.getTestMessageUrl(info));
// };

// module.exports = sendEmail;

const createTransporter = require("../config/email");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: `"CraftSite" <${process.env.MAIL_FROM}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);

  return info;
};

module.exports = sendEmail;