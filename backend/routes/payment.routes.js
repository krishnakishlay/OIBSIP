const router = require("express").Router();
const payment = require("../controllers/payment.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.post("/create-order", payment.createRazorpayOrder);
router.post("/verify", payment.verifyPayment);
router.post("/mark-success", payment.markOrderSuccessForNow);

module.exports = router;