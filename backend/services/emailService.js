require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= TEST EMAIL CONNECTION =================

const verifyEmailConnection = async () => {
  try {
    await transporter.verify();

    console.log("Email server is ready");
    console.log("Sender email:", process.env.EMAIL_USER);
  } catch (error) {
    console.error("Email server connection failed:");
    console.error(error.message);
  }
};

// ================= SEND REGISTRATION OTP =================

const sendOtpEmail = async (email, otp) => {
  try {
    console.log("=================================");
    console.log("Sending registration OTP");
    console.log("From:", process.env.EMAIL_USER);
    console.log("To:", email);
    console.log("OTP:", otp);
    console.log("=================================");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "E-Commerce Email Verification OTP",
      text: `Your verification OTP is ${otp}. It will expire in 10 minutes.`,
    });

    console.log("Registration OTP email sent successfully");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);

    return info;
  } catch (error) {
    console.error("Registration OTP email failed:");
    console.error(error.message);

    throw new Error("Failed to send OTP email");
  }
};

// ================= SEND RESET PASSWORD OTP =================

const sendResetOtpEmail = async (email, otp) => {
  try {
    console.log("=================================");
    console.log("Sending password reset OTP");
    console.log("From:", process.env.EMAIL_USER);
    console.log("To:", email);
    console.log("OTP:", otp);
    console.log("=================================");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "E-Commerce Password Reset OTP",
      text: `Your password reset OTP is ${otp}. It will expire in 10 minutes.`,
    });

    console.log("Password reset OTP email sent successfully");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);

    return info;
  } catch (error) {
    console.error("Password reset OTP email failed:");
    console.error(error.message);

    throw new Error("Failed to send password reset OTP email");
  }
};

module.exports = {
  verifyEmailConnection,
  sendOtpEmail,
  sendResetOtpEmail,
};