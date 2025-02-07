import express from "express";
import * as controllers from "../controllers/usuarios.controller.js";
import { validateUsuario } from "../../middleware/usuario.validate.middleware.js";
import { validateToken } from "../../middleware/token.middleware.js";
import { upload, resizeImage } from "../../services/upload.service.js";

const route = express.Router();

// Login de usuario
route.post("/usuario/login", controllers.login);

// Obtener lista de usuarios (requiere token)
route.get("/usuarios", [validateToken], controllers.getUsuarios);// Obtener lista de usuarios 
route.post("/usuarios", validateUsuario, controllers.agregarUsuario);// Crear un nuevo usuario
route.delete("/usuarios/:id", [validateToken], controllers.borrarUsuario);// Eliminar un usuario (lógicamente) por ID 
route.put("/usuarios/:id", [validateToken, validateUsuario], controllers.actualizarUsuario);// Actualizar un usuario completamente por ID 
route.patch("/usuarios/:id", [validateToken, upload, resizeImage], controllers.actualizarParcialUsuario);//Actualizar parcial usaurio
route.get("/usuarios/:id", [validateToken], controllers.getUsuarioPorId);// Obtener un usuario específico por ID 
route.patch("/usuarios/:id/imagen",[validateToken, upload, resizeImage],controllers.actualizarImagenUsuario);

export default route;
