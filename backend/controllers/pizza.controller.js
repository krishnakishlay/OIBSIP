const Pizza = require("../models/Pizza.model");
const { sendSuccess, sendError } = require("../utils/response.utils");

exports.getAllPizzas = async (req, res, next) => {
  try {
    const filter = { available: true };
    if (req.query.type) filter.type = req.query.type;

    const pizzas = await Pizza.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, pizzas);
  } catch (err) {
    return next(err);
  }
};

exports.getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return sendError(res, "Pizza not found", 404);
    return sendSuccess(res, pizza);
  } catch (err) {
    return next(err);
  }
};
