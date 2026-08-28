const express = require("express");

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const router = express.Router();

// ======================================================
// PUBLIC
// ======================================================

// Create new booking
// POST /api/bookings
router.post("/", createBooking);


// ======================================================
// ADMIN
// ======================================================

// Get all bookings
// GET /api/bookings
router.get("/", getBookings);

// Get single booking
// GET /api/bookings/:id
router.get("/:id", getBookingById);

// Update booking
// PUT /api/bookings/:id
router.put("/:id", updateBooking);

// Delete booking
// DELETE /api/bookings/:id
router.delete("/:id", deleteBooking);


// ======================================================
// EXPORT
// ======================================================

module.exports = router;