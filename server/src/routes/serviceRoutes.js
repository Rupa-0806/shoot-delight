const express = require("express");
const { body } = require("express-validator");
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getServiceById);

router.post(
  "/",
  protect,
  [body("title").notEmpty(), body("description").notEmpty(), body("duration").notEmpty()],
  validate,
  createService
);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;
