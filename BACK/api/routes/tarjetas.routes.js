import express from "express";
import * as controllers from "../controllers/tarjetas.controller.js";
import { validateTarjeta } from "../../middleware/tarjetas.validate.middleware.js";
import { validateToken } from "../../middleware/token.middleware.js";

const route = express.Router();


route.get("/listas/:listId/tarjetas", [validateToken], controllers.getTarjetas); // Obtener todas las tarjetas de una lista
route.get("/listas/:tableroId/tarjetas/:tarjetaId", [validateToken], controllers.getTarjetaById); // Obtener una lista específica
route.post("/listas/:listId/tarjetas", [validateToken, validateTarjeta], controllers.crearTarjeta);
route.patch("/tarjetas/:tarjetaId", [validateToken, validateTarjeta], controllers.actualizarTarjeta); // Actualizar una tarjeta
route.delete("/tarjetas/:tarjetaId", [validateToken], controllers.borrarTarjeta); // Eliminar una tarjeta

export default route;
