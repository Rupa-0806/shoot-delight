const asyncHandler = require("express-async-handler");
const prisma = require("../config/db");

// Normalize any date input to midnight UTC so date-only comparisons work
const toDateOnly = (d) => {
  const date = new Date(d);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

// GET /api/slots?date=YYYY-MM-DD  -> available slots for that date
const getSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const where = date ? { date: toDateOnly(date) } : {};

  const slots = await prisma.slot.findMany({
    where,
    orderBy: { time: "asc" },
  });

  // A slot is "available" if not blocked and not already tied to a booking
  const data = slots.map((s) => ({
    ...s,
    available: !s.isBlocked && !s.bookingId,
  }));

  res.json({ success: true, data });
});

// POST /api/slots (admin only) - create one or many slots for a date
const createSlots = asyncHandler(async (req, res) => {
  const { date, times } = req.body; // times: ["10:00 AM", "12:00 PM", ...]
  const dateOnly = toDateOnly(date);

  const created = await prisma.$transaction(
    times.map((time) =>
      prisma.slot.upsert({
        where: { date_time: { date: dateOnly, time } },
        update: {},
        create: { date: dateOnly, time },
      })
    )
  );

  res.status(201).json({ success: true, data: created });
});

// PUT /api/slots/:id/block (admin only) - block a slot or mark a holiday
const blockSlot = asyncHandler(async (req, res) => {
  const slot = await prisma.slot.update({
    where: { id: req.params.id },
    data: { isBlocked: true },
  });
  res.json({ success: true, data: slot });
});

const unblockSlot = asyncHandler(async (req, res) => {
  const slot = await prisma.slot.update({
    where: { id: req.params.id },
    data: { isBlocked: false },
  });
  res.json({ success: true, data: slot });
});

// DELETE /api/slots/:id (admin only)
const deleteSlot = asyncHandler(async (req, res) => {
  await prisma.slot.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: "Slot deleted" });
});

module.exports = { getSlots, createSlots, blockSlot, unblockSlot, deleteSlot, toDateOnly };
