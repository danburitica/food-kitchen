const axios = require("axios");
require("dotenv").config();
const recipeSchema = require("../models/recipe");
const orderHistorySchema = require("../models/orderHistory");

const store_base_url =
  process.env.STORE_BASE_URL || "http://localhost:3001/api/store";

/**
 * Éste endpoint es accedido desde la interfáz gráfica a través de un botón.
 * Genera un plato aleatorio entre la lista almacenada en la base de datos.
 * Hace una petición asíncrona a la bodega de alimentos, solicitando la lista de ingredientes, con sus cantidades.
 * Si es correcto, se compara los ingredientes que nos envían con los que requerimos.
 * Si coinciden las listas, se despacha el plato preparado.
 */

const manageRequests = async (req, res) => {
  const recipes = await recipeSchema.find();

  // Status puede ser "delivered" o "pending"
  const order = {
    id: Date.now(),
    title: "",
    ingredients: [],
    status: "pending",
    date: new Date().toLocaleString(),
  };
  const random = Math.floor(Math.random() * recipes.length);

  order.title = recipes[random].title;
  order.ingredients = recipes[random].ingredients;

  try {
    const { data: storeIngredients } = await axios.post(store_base_url, {
      ingredients: order.ingredients,
    });
    if (storeIngredients) {
      order.status = "delivered";
      const newOrderHistory = new orderHistorySchema(order);
      await newOrderHistory.save();

      res.json(order);
    }
  } catch (error) {
    res.json({ message: error });
  }
};

/**
 * Método encargado de retornar las recetas o el historial de la base de datos.
 */

const getKitchen = async (req, res) => {
  const key = req.query.key;
  if (key === "recipes") {
    const recipes = await recipeSchema.find();
    res.json(recipes);
  } else if (key === "history") {
    const history = await orderHistorySchema.find();
    res.json(history);
  } else {
    res.json({ message: "No matches" });
  }
};

module.exports = {
  manageRequests,
  getKitchen,
};
