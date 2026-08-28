const asyncHandler = require("express-async-handler");
const prisma = require("../config/db");

// GET /api/services  (public - only active, unless admin requests all)
const getServices = asyncHandler(async (req, res) => {
  const includeInactive = req.query.all === "true" && req.admin;
  const services = await prisma.service.findMany({
    where: includeInactive ? {} : { active: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: services });
});

const getServiceById = asyncHandler(async (req, res) => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) return res.status(404).json({ success: false, message: "Service not found" });
  res.json({ success: true, data: service });
});

// POST /api/services (admin only)
const createService = asyncHandler(async (req, res) => {
  const { title, description, price, duration } = req.body;
  const service = await prisma.service.create({
    data: { title, description, price: price ? Number(price) : null, duration },
  });
  res.status(201).json({ success: true, data: service });
});

// PUT /api/services/:id (admin only)
const updateService = asyncHandler(async (req, res) => {
  const { title, description, price, duration, active } = req.body;
  const service = await prisma.service.update({
    where: { id: req.params.id },
    data: { title, description, price: price !== undefined ? Number(price) : undefined, duration, active },
  });
  res.json({ success: true, data: service });
});

// DELETE /api/services/:id (admin only)
const deleteService = asyncHandler(async (req, res) => {
  await prisma.service.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: "Service deleted" });
});

module.exports = { getServices, getServiceById, createService, updateService, deleteService };
