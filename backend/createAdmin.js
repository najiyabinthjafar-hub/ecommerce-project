// require("dotenv").config({ path: "./backend/.env" });

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const User = require("./models/User");

// const createAdmin = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     console.log("MongoDB connected");

//     const email = "admin@test.com";
//     const password = "Admin@123";

//     const hashedPassword = await bcrypt.hash(password, 10);

//     let admin = await User.findOne({ email });

//     if (admin) {
//       admin.password = hashedPassword;
//       admin.role = "admin";
//       admin.isEmailVerified = true;
//       admin.profileCompleted = true;
//       admin.status = "active";

//       await admin.save();

//       console.log("Existing user updated to admin successfully!");
//     } else {
//       admin = await User.create({
//         name: "Admin Test",
//         email,
//         phone: "9999999999",
//         password: hashedPassword,
//         role: "admin",
//         isEmailVerified: true,
//         profileCompleted: true,
//         status: "active",
//       });

//       console.log("Admin created successfully!");
//     }

//     console.log("Email:", email);
//     console.log("Password:", password);
//     console.log("Role:", admin.role);

//     await mongoose.disconnect();
//     process.exit(0);
//   } catch (error) {
//     console.error("Error:", error.message);
//     process.exit(1);
//   }
// };

// createAdmin();




require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    // =========================================================
    // CONNECT TO MONGODB
    // =========================================================

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // =========================================================
    // ADMIN CREDENTIALS FROM .ENV
    // =========================================================

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "ADMIN_EMAIL or ADMIN_PASSWORD is missing in backend/.env"
      );
    }

    // =========================================================
    // HASH PASSWORD
    // =========================================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // =========================================================
    // FIND EXISTING USER
    // =========================================================

    let admin = await User.findOne({ email });

    // =========================================================
    // IF USER EXISTS → UPDATE AS ADMIN
    // =========================================================

    if (admin) {
      admin.password = hashedPassword;
      admin.role = "admin";
      admin.isEmailVerified = true;
      admin.profileCompleted = true;
      admin.status = "active";

      await admin.save();

      console.log("Existing user updated to admin successfully!");
    }

    // =========================================================
    // IF USER DOES NOT EXIST → CREATE ADMIN
    // =========================================================

    else {
      admin = await User.create({
        name: "RIZO Admin",
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

    // =========================================================
    // ADMIN DETAILS
    // =========================================================

    console.log("Email:", email);
    console.log("Role:", admin.role);

    // =========================================================
    // DISCONNECT
    // =========================================================

    await mongoose.disconnect();

    console.log("MongoDB disconnected");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);

    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
};

createAdmin();