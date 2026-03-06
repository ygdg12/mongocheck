const express = require("express");
const { adminLogin } = require("../controllers/authController");

const router = express.Router();

// Hardcoded admin login
router.post("/admin-login", adminLogin);

module.exports = router;

