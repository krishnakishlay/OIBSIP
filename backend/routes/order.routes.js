const router = require("express").Router();
const order = require("../controllers/order.controller");
const { protect, requireAdmin } = require("../middleware/auth.middleware");

router.use(protect);
router.post("/", order.createOrder);
router.get("/my", order.getMyOrders);
router.get("/", requireAdmin, order.getAllOrders);
router.patch("/:id/status", requireAdmin, order.updateOrderStatus);
router.get("/:id", order.getOrderById);

module.exports = router;