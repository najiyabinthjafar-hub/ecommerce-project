const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
<<<<<<< HEAD
    // 1. Get Authorization header
=======
>>>>>>> origin/feature/suhana-auth
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
<<<<<<< HEAD
        success: false,
=======
>>>>>>> origin/feature/suhana-auth
        message: "Authentication required",
      });
    }

<<<<<<< HEAD
    // 2. Get JWT token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // 3. Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 4. Get user ID from JWT
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // 5. Find user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
=======
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
>>>>>>> origin/feature/suhana-auth
        message: "User not found",
      });
    }

<<<<<<< HEAD
    // 6. Check user status
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
=======
    if (user.status !== "active") {
      return res.status(403).json({
>>>>>>> origin/feature/suhana-auth
        message: "Account is blocked",
      });
    }

<<<<<<< HEAD
    // 7. Attach user to request
    req.user = user;

    // 8. Continue to controller
    next();

  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error.message);

    return res.status(401).json({
      success: false,
=======
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
>>>>>>> origin/feature/suhana-auth
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  protect,
};