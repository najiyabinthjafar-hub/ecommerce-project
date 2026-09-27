const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");

const generateOtp = require("../utils/generateOtp");
const generateToken = require("../utils/generateToken");

const notificationService = require("./notificationService");

const {
  sendOtpEmail,
  sendResetOtpEmail,
} = require("./emailService");

// ================= GOOGLE CLIENT =================

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// ================= REGISTER USER =================

const registerUser = async ({
  name,
  email,
  phone,
  password,
}) => {
  const existingEmail = await User.findOne({
    email,
  });

  if (existingEmail) {
    throw new Error("Email already registered");
  }

  const existingPhone = await User.findOne({
    phone,
  });

  if (existingPhone) {
    throw new Error(
      "Phone number already registered"
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  const otp = generateOtp();

  // ==========================================
  // USER + ADMIN NOTIFICATION TRANSACTION
  // ==========================================

  const session =
    await mongoose.startSession();

  let user;

  try {
    await session.withTransaction(
      async () => {
        // ======================================
        // NORMAL USER REGISTRATION
        // ======================================
        //
        // IMPORTANT:
        // googleId is NOT included here.
        //
        // Normal users should not have:
        // googleId: null
        //
        // Google ID is saved only for
        // Google registration.

        const createdUsers =
          await User.create(
            [
              {
                name,
                email,
                phone,
                password: hashedPassword,

                otp,

                otpExpiresAt: new Date(
                  Date.now() +
                    10 * 60 * 1000
                ),

                otpAttempts: 0,
              },
            ],
            {
              session,
            }
          );

        user = createdUsers[0];

        // ======================================
        // ADMIN NOTIFICATION
        // ======================================

        const admin =
          await notificationService.getAdminUser(
            session
          );

        // Notification is created only
        // when an admin user exists.
        if (admin) {
          await notificationService.createNotification(
            {
              user: admin._id,

              title: "New Customer",

              message: `New customer ${user.name} has registered.`,

              // Notification task handles
              // the USER enum.
              type: "USER",
            },
            session
          );
        }
      }
    );
  } finally {
    await session.endSession();
  }

  // ==========================================
  // SEND OTP
  // ==========================================

  await sendOtpEmail(email, otp);

  return {
    userId: user._id,

    message:
      "Registration successful. OTP sent to your email.",
  };
};

// ================= VERIFY EMAIL OTP =================

const verifyEmailOtp = async (
  email,
  otp
) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    throw new Error(
      "Email already verified"
    );
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw new Error("OTP not found");
  }

  if (new Date() > user.otpExpiresAt) {
    throw new Error("OTP expired");
  }

  if (user.otpAttempts >= 5) {
    throw new Error(
      "Too many OTP attempts"
    );
  }

  if (user.otp !== otp) {
    user.otpAttempts += 1;

    await user.save();

    throw new Error("Invalid OTP");
  }

  // ================= MARK EMAIL VERIFIED =================

  user.isEmailVerified = true;

  user.otp = null;
  user.otpExpiresAt = null;
  user.otpAttempts = 0;

  await user.save();

  // ================= GENERATE JWT =================

  const token = generateToken(user._id);

  return {
    message:
      "Email verified successfully",

    token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileCompleted:
        user.profileCompleted,
    },
  };
};

// ================= RESEND OTP =================

const resendOtp = async (email) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    throw new Error(
      "Email already verified"
    );
  }

  const otp = generateOtp();

  user.otp = otp;

  user.otpExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  user.otpAttempts = 0;

  await user.save();

  console.log(
    "OTP email:",
    email
  );

  console.log(
    "EMAIL_USER loaded:",
    !!process.env.EMAIL_USER
  );

  console.log(
    "EMAIL_PASS loaded:",
    !!process.env.EMAIL_PASS
  );

  await sendOtpEmail(email, otp);

  return {
    message:
      "New OTP sent successfully",
  };
};

// ================= LOGIN USER =================

const loginUser = async ({
  email,
  password,
}) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  if (!user.isEmailVerified) {
    throw new Error(
      "Please verify your email first"
    );
  }

  if (user.status !== "active") {
    throw new Error(
      "Your account is blocked"
    );
  }

  // Google-only user may not have password
  if (!user.password) {
    throw new Error(
      "This account uses Google Login. Please continue with Google."
    );
  }

  const passwordMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatch) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const token = generateToken(
    user._id
  );

  return {
    token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileCompleted:
        user.profileCompleted,
    },
  };
};

// ================= GOOGLE LOGIN =================

const googleLogin = async (idToken) => {
  if (!idToken) {
    throw new Error(
      "Google ID token is required"
    );
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error(
      "GOOGLE_CLIENT_ID is not configured"
    );
  }

  // ================= VERIFY GOOGLE TOKEN =================

  let ticket;

  try {
    ticket =
      await googleClient.verifyIdToken({
        idToken,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });
  } catch (error) {
    console.error(
      "GOOGLE TOKEN VERIFICATION ERROR:",
      error.message
    );

    throw new Error(
      "Invalid Google authentication token"
    );
  }

  const payload =
    ticket.getPayload();

  if (!payload) {
    throw new Error(
      "Unable to read Google account information"
    );
  }

  const {
    sub: googleId,
    email,
    email_verified,
    name,
  } = payload;

  // ================= GOOGLE EMAIL CHECK =================

  if (!email) {
    throw new Error(
      "Google account email not available"
    );
  }

  if (!email_verified) {
    throw new Error(
      "Google email is not verified"
    );
  }

  const normalizedEmail =
    email.toLowerCase();

  // ================= FIND USER BY GOOGLE ID =================

  let user =
    await User.findOne({
      googleId,
    });

  // ================= FIND USER BY EMAIL =================

  if (!user) {
    user =
      await User.findOne({
        email: normalizedEmail,
      });
  }

  // ================= EXISTING USER =================

  if (user) {
    if (user.status !== "active") {
      throw new Error(
        "Your account is blocked"
      );
    }

    // ==========================================
    // CONNECT GOOGLE ACCOUNT
    // ==========================================
    //
    // Existing normal-registration user can
    // login using Google with the same email.
    //
    // Keep the existing connection logic.

    if (!user.googleId) {
      user.googleId = googleId;
    }

    user.isEmailVerified = true;

    if (!user.name && name) {
      user.name = name;
    }

    await user.save();
  }

  // ================= CREATE NEW GOOGLE USER =================

  if (!user) {
    // IMPORTANT:
    // googleId is saved ONLY for Google users.
    //
    // Do NOT save:
    // phone: null
    //
    // The phone field is intentionally omitted.
    // User schema no longer has default: null.

    user = await User.create({
      name:
        name || "Google User",

      email: normalizedEmail,

      googleId,

      // Do NOT add phone: null here.

      // Google user does not need password
      password: null,

      role: "user",

      isEmailVerified: true,

      profileCompleted: false,

      status: "active",
    });
  }

  // ================= GENERATE JWT =================

  const token = generateToken(
    user._id
  );

  return {
    token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileCompleted:
        user.profileCompleted,
    },
  };
};

// ================= FORGOT PASSWORD =================

const forgotPassword = async (
  email
) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  const otp = generateOtp();

  user.resetOtp = otp;

  user.resetOtpExpiresAt =
    new Date(
      Date.now() +
        10 * 60 * 1000
    );

  await user.save();

  await sendResetOtpEmail(
    email,
    otp
  );

  return {
    message:
      "Password reset OTP sent to your email",
  };
};

// ================= RESET PASSWORD =================

const resetPassword = async ({
  email,
  otp,
  newPassword,
}) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  if (
    !user.resetOtp ||
    !user.resetOtpExpiresAt
  ) {
    throw new Error(
      "Reset OTP not found"
    );
  }

  if (
    new Date() >
    user.resetOtpExpiresAt
  ) {
    throw new Error(
      "Reset OTP expired"
    );
  }

  if (user.resetOtp !== otp) {
    throw new Error(
      "Invalid reset OTP"
    );
  }

  if (newPassword.length < 6) {
    throw new Error(
      "New password must be at least 6 characters"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10
    );

  user.password =
    hashedPassword;

  user.resetOtp = null;
  user.resetOtpExpiresAt = null;

  await user.save();

  return {
    message:
      "Password reset successfully",
  };
};

// ================= EXPORT =================

module.exports = {
  registerUser,
  verifyEmailOtp,
  resendOtp,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
};