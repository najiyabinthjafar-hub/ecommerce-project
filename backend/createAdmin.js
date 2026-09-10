require("dotenv").config({ path: "./backend/.env" });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "admin@test.com";
    const password = "Admin@123";

    const hashedPassword = await bcrypt.hash(password, 10);

    let admin = await User.findOne({ email });

    if (admin) {
      admin.password = hashedPassword;
      admin.role = "admin";
      admin.isEmailVerified = true;
      admin.profileCompleted = true;
      admin.status = "active";

      await admin.save();

      console.log("Existing user updated to admin successfully!");
    } else {
      admin = await User.create({
        name: "Admin Test",
        email,
        phone: "9999999999",
        password: hashedPassword,
        role: "admin",
        isEmailVerified: true,
        profileCompleted: true,
        status: "active",
      });

      console.log("Admin created successfully!");
    }

    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", admin.role);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();