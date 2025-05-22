const express = require("express");
const PaymentController = require("../controllers/PaymentController");
const Authorization = require("../services/Authorization");
const router = express.Router();

router.post(
  "/create-checkout-session",
  Authorization.authorized,
  PaymentController.paymentProcess
);

router.get(
  "/verify-payment/:id",
  Authorization.authorized,
  PaymentController.paymentVerify
);

// Note: The webhook endpoint is now handled directly in index.js
module.exports = router;


// stripe listen --forward-to localhost:5000/api/webhook
