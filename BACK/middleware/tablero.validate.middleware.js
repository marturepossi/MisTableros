import { tableroSchema } from "../schemas/tablero.schema.js";

export async function validateTablero(req, res, next) {
  try {
    const datosValidados = await tableroSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    req.body = datosValidados; 
    next();
  } catch (error) {
    console.error("Errores de validación del tablero:", error.errors);
    res.status(400).json({ message: "Errores de validación", errors: error.errors });
  }
}
