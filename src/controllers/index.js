const JSONdb = require("simple-json-db");
const db = new JSONdb("./database.json");
const axios = require("axios");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

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
  const { recipes: database } = db.JSON();

  // Status puede ser "delivered" o "pending"
  const order = {
    id: uuidv4(),
    title: "",
    ingredients: {},
    status: "pending",
    date: new Date().toLocaleString(),
  };
  const random = Math.floor(Math.random() * Object.keys(database).length);

  order.title = database[random].title;
  order.ingredients = database[random].ingredients;

  try {
    const { data: storeIngredients } = await axios.post(store_base_url, {
      ingredients: order.ingredients,
    });

    if (
      JSON.stringify(storeIngredients) === JSON.stringify(order.ingredients)
    ) {
      order.status = "delivered";
      db.set("ordersHistory", [...db.get("ordersHistory"), order]);
      db.sync();
      res.json(order);
    }
  } catch (error) {
    res.json({ message: error });
  }
};

/**
 * Método encargado de retornar las recetas o el historial de la base de datos.
 */

const getKitchen = (req, res) => {
  const key = req.query.key;

  res.json(
    key === "recipes"
      ? db.get("recipes")
      : key === "history"
      ? db.get("ordersHistory")
      : { message: "No matches" }
  );
};

module.exports = {
  manageRequests,
  getKitchen,
};
