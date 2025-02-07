import express, { Router } from "express";
import * as controllers from "../controllers/tableros.controller.js";
import { validateTablero } from "../../middleware/tablero.validate.middleware.js";
import { upload, resizeImage } from "../../services/upload.service.js"; 
import { validateToken } from "../../middleware/token.middleware.js";

const route = express.Router();

route.get("/tableros/todos", controllers.getTableros); // Obtener todos los tableros sin filtrar por usuario
route.get("/tableros", [validateToken], controllers.getTablerosbyUser); // Obtener todos los tableros de un usuario
route.get("/tableros/:id", controllers.getTableroId); // Obtener un tablero por su ID
route.post("/tableros", [upload, resizeImage, validateToken, validateTablero], controllers.crearTablero); // Fotos y validaciones
route.delete("/tableros/:id", [validateToken], controllers.borrarTablero); // Eliminar un tablero
route.put("/tableros/:id", [validateToken, validateTablero], controllers.reemplazarTablero); // Reemplazar un tablero
route.patch("/tableros/:id", [validateToken, upload, resizeImage], controllers.actualizarTablero);
route.post("/tableros/:id/miembros/email", [validateToken], controllers.agregarMiembroPorEmail);





export default route;

