require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email verification OTP
const sendOtpEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "E-Commerce Email Verification OTP",
      text: `Your verification OTP is ${otp}. It will expire in 10 minutes.`,
    });

    console.log("VERIFICATION EMAIL SENT:", info.messageId);
  } catch (error) {
    console.error("VERIFICATION EMAIL ERROR:", error);
    throw error;
  }
};

// Password reset OTP
const sendResetOtpEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "E-Commerce Password Reset OTP",
      text: `Your password reset OTP is ${otp}. It will expire in 10 minutes.`,
    });

    console.log("RESET EMAIL SENT:", info.messageId);
  } catch (error) {
    console.error("RESET EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = {
  sendOtpEmail,
  sendResetOtpEmail,
};