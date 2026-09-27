const mongoose = require("mongoose");
const dns = require("dns");

const User = require("../models/User");

// Use Google and Cloudflare DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// ==========================================
// SETUP USER INDEXES + CLEAN OLD NULL VALUES
// ==========================================

const setupUserIndexes = async () => {
  try {
    // ==========================================
    // REMOVE OLD googleId: null VALUES
    // ==========================================

    const googleIdCleanup =
      await User.updateMany(
        {
          googleId: null,
        },
        {
          $unset: {
            googleId: "",
          },
        }
      );

    console.log(
      `Old googleId: null values cleaned. Modified: ${googleIdCleanup.modifiedCount}`
    );

    // ==========================================
    // REMOVE OLD phone: null VALUES
    // ==========================================

    const phoneCleanup =
      await User.updateMany(
        {
          phone: null,
        },
        {
          $unset: {
            phone: "",
          },
        }
      );

    console.log(
      `Old phone: null values cleaned. Modified: ${phoneCleanup.modifiedCount}`
    );

    // ==========================================
    // GET EXISTING USER INDEXES
    // ==========================================

    const indexes =
      await User.collection
        .listIndexes()
        .toArray();

    // ==========================================
    // GOOGLE ID INDEXES
    // ==========================================

    const googleIdIndexes =
      indexes.filter(
        (index) =>
          index.key &&
          index.key.googleId === 1 &&
          Object.keys(index.key).length === 1
      );

    // ==========================================
    // REMOVE INCORRECT GOOGLE ID INDEXES
    // ==========================================

    for (const index of googleIdIndexes) {
      if (
        index.unique === true &&
        index.sparse !== true
      ) {
        console.log(
          `Removing incorrect googleId index: ${index.name}`
        );

        await User.collection.dropIndex(
          index.name
        );
      }
    }

    // ==========================================
    // PHONE INDEXES
    // ==========================================

    const phoneIndexes =
      indexes.filter(
        (index) =>
          index.key &&
          index.key.phone === 1 &&
          Object.keys(index.key).length === 1
      );

    // ==========================================
    // REMOVE INCORRECT PHONE INDEXES
    // ==========================================

    for (const index of phoneIndexes) {
      if (
        index.unique === true &&
        index.sparse !== true
      ) {
        console.log(
          `Removing incorrect phone index: ${index.name}`
        );

        await User.collection.dropIndex(
          index.name
        );
      }
    }

    // ==========================================
    // CREATE CORRECT GOOGLE ID INDEX
    // ==========================================

    await User.collection.createIndex(
      {
        googleId: 1,
      },
      {
        unique: true,
        sparse: true,
        name: "googleId_1",
      }
    );

    console.log(
      "googleId unique sparse index is ready."
    );

    // ==========================================
    // CREATE CORRECT PHONE INDEX
    // ==========================================

    await User.collection.createIndex(
      {
        phone: 1,
      },
      {
        unique: true,
        sparse: true,
        name: "phone_1",
      }
    );

    console.log(
      "phone unique sparse index is ready."
    );
  } catch (error) {
    console.error(
      "User index setup failed:",
      error.message
    );

    throw error;
  }
};

// ==========================================
// CONNECT DATABASE
// ==========================================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      `MongoDB connected: ${conn.connection.host}`
    );

    // ======================================
    // CLEAN OLD DATA + SETUP INDEXES
    // ======================================

    await setupUserIndexes();

    // ======================================
    // INITIALIZE SCHEMA INDEXES
    // ======================================

    await User.init();

    console.log(
      "MongoDB indexes initialized successfully."
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;