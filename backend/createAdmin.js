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

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin user already exists");
      console.log("Email:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
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
    console.log("Email:", admin.email);
    console.log("Password:", password);
    console.log("Role:", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();