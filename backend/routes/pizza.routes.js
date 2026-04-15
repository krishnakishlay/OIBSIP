const router = require("express").Router();
const pizza = require("../controllers/pizza.controller");

router.get("/", pizza.getAllPizzas);
router.get("/:id", pizza.getPizzaById);

module.exports = router;