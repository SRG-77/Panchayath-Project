const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");

router.post("/create-order", paymentController.createOrder);
router.post("/verify", paymentController.verifyPayment);
router.get("/all", paymentController.getAllDonations);

module.exports = router;
