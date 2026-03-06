const jwt = require("jsonwebtoken");
const ADMIN_EMAIL = "admin@tsedey.com";
const ADMIN_PASSWORD = "Admin@123";

// POST /api/auth/admin-login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { email: ADMIN_EMAIL, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      data: {
        token,
        admin: {
          email: ADMIN_EMAIL,
          isAdmin: true,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { adminLogin, ADMIN_EMAIL };

