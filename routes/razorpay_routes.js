const express = require("express");
const router = express.Router();
const razorpay_controller = require("./../controllers/razorpay_controllers");

router.post("/order", razorpay_controller.orders);

router.post("/success", razorpay_controller.success);

module.exports = router;
