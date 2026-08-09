const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

// Verifies the Bearer JWT and attaches the admin to req.admin
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin no longer exists" });
    }

    req.admin = { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
  }
};

module.exports = { protect };
