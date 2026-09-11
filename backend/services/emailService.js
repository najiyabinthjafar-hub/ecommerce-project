require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "E-Commerce Email Verification OTP",
    text: `Your verification OTP is ${otp}. It will expire in 10 minutes.`,
  });
};

const sendResetOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "E-Commerce Password Reset OTP",
    text: `Your password reset OTP is ${otp}. It will expire in 10 minutes.`,
  });
};

module.exports = {
  sendOtpEmail,
  sendResetOtpEmail,
};