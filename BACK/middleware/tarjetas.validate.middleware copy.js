import { tarjetaSchema } from "../schemas/tarjeta.schema.js";

export async function validateTarjeta(req, res, next) {
    try {
        
        if (req.params.listId && !req.body.listId) {
            req.body.listId = req.params.listId;
        }

        console.log("Middleware: Datos antes de validar:", req.body);

        const datosValidados = await tarjetaSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        console.log("Middleware: Datos validados:", datosValidados);

        req.body = datosValidados; 
        next();
    } catch (error) {
        console.error("Errores de validación en middleware:", error.errors);
        res.status(400).json({ message: error.errors });
    }
}



