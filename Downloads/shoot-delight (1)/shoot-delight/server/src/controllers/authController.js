const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const generateToken = require("../utils/generateToken");

// POST /api/admin/login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = generateToken(admin.id);

  res.json({
    success: true,
    data: {
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    },
  });
});

// GET /api/admin/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin });
});

module.exports = { loginAdmin, getMe };
