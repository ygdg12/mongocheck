const jwt = require("jsonwebtoken");

// adminAuthMiddleware: verifies JWT issued by /api/auth/admin-login
// and ensures the caller is an admin.
const adminAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Admins only" });
    }

    req.user = { email: payload.email, isAdmin: true };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = adminAuthMiddleware;

