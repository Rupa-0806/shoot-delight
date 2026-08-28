const express = require("express");
const { body } = require("express-validator");
const {
  getSlots,
  createSlots,
  blockSlot,
  unblockSlot,
  deleteSlot,
} = require("../controllers/slotController");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/", getSlots);

router.post(
  "/",
  protect,
  [body("date").notEmpty(), body("times").isArray({ min: 1 })],
  validate,
  createSlots
);
router.put("/:id/block", protect, blockSlot);
router.put("/:id/unblock", protect, unblockSlot);
router.delete("/:id", protect, deleteSlot);

module.exports = router;
