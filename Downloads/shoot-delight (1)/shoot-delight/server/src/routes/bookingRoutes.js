const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const router = express.Router();

const bookingValidation = [
  body("serviceId").notEmpty().withMessage("Service is required"),
  body("bookingDate").notEmpty().withMessage("Date is required"),
  body("location").notEmpty(),
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("eventType").notEmpty(),
  body("agreeToTerms")
    .custom((val) => val === true || val === "true")
    .withMessage("You must accept the terms"),
];

router.post("/", bookingValidation, validate, createBooking);
router.get("/", protect, getBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id", protect, updateBooking);
router.delete("/:id", protect, deleteBooking);

module.exports = router;
