const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const sendResetEmail = async (to, resetURL) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Pizzeriaa — Reset your password",
    html: `<p>Click <a href="${resetURL}">here</a> to reset your password. Link expires in 1 hour.</p>`,
  });
};

module.exports = { sendResetEmail };
