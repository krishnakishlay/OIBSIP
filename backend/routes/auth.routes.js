const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { validate, registerRules, loginRules } = require("../middleware/validate.middleware");

router.post("/register",       validate(registerRules), auth.register);
router.post("/login",          validate(loginRules),    auth.login);
router.post("/refresh",        auth.refresh);
router.post("/forgot-password",auth.forgotPassword);
router.post("/reset-password/:token", auth.resetPassword);
router.get("/me", protect, auth.getMe);

module.exports = router;
