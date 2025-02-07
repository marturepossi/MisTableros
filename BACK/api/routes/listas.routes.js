import express from "express";
import * as controllers from "../controllers/listas.controller.js";
import { validateLista } from "../../middleware/listas.validate.middleware.js";
import { validateToken } from "../../middleware/token.middleware.js";

const route = express.Router();

// Rutas para listas
route.get("/tableros/:tableroId/listas", [validateToken], controllers.getListas); // Obtener todas las listas de un tablero
route.get("/tableros/:tableroId/listas/:listaId", [validateToken], controllers.getListaById); // Obtener una lista específica
route.post("/tableros/:tableroId/listas", [validateToken, validateLista], controllers.crearLista); // Crear una lista
route.patch("/tableros/:tableroId/listas/:listaId", [validateToken, validateLista], controllers.actualizarLista); // Actualizar una lista
route.delete("/tableros/:tableroId/listas/:listaId", [validateToken], controllers.borrarLista); // Eliminar una lista

export default route;
