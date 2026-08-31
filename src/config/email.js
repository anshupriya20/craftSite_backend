// const nodemailer = require("nodemailer");

// const createTransporter = async () => {
//   // For quick dev testing — auto-generates a throwaway test inbox
//   const testAccount = await nodemailer.createTestAccount();

//   return nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false,
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });
// };

// module.exports = createTransporter;

const nodemailer = require("nodemailer");

const createTransporter = async () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

module.exports = createTransporter;