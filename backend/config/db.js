const mongoose = require("mongoose");
const dns = require("dns");

const User = require("../models/User");

// Use Google and Cloudflare DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const setupGoogleIdIndex = async () => {
  try {
    // ==========================================
    // REMOVE OLD googleId: null VALUES
    // ==========================================

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
      "Old googleId: null values cleaned."
    );

    // ==========================================
    // CHECK EXISTING GOOGLE ID INDEXES
    // ==========================================

    const indexes =
      await User.collection
        .listIndexes()
        .toArray();

    const googleIdIndexes = indexes.filter(
      (index) =>
        index.key &&
        index.key.googleId === 1 &&
        Object.keys(index.key).length === 1
    );

    // ==========================================
    // REMOVE INCORRECT UNIQUE NON-SPARSE INDEX
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
    // CREATE CORRECT INDEX
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
  } catch (error) {
    console.error(
      "Google ID index setup failed:",
      error.message
    );

    throw error;
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      `MongoDB connected: ${conn.connection.host}`
    );

    await setupGoogleIdIndex();

    // Make sure all schema indexes are initialized
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