const JSONdb = require("simple-json-db");
const db = new JSONdb("./database.json");
const axios = require("axios");
require("dotenv").config();

const { STORE_BASE_URL } = process.env;

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
    title: "",
    ingredients: {},
    status: "pending",
    date: new Date().toLocaleString(),
  };
  const random = Math.floor(Math.random() * Object.keys(database).length) + 1;

  order.title = database[random].title;
  order.ingredients = database[random].ingredients;

  try {
    const { data: storeIngredients } = await axios.post(STORE_BASE_URL, {
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
    console.error(error);
  }
};

/**
 * Método auxiliar.
 * Pendiente por probar, si no es necesario, se borra.
 */

/* const getRecipe = async (orderIngredients) => {
  try {
    const { data } = await axios.post(STORE_BASE_URL, orderIngredients);
    return data;
  } catch (error) {
    console.error(error);
  }
}; */

module.exports = {
  manageRequests,
};
