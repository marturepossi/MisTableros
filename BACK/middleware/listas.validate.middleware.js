import { listaSchema } from "../schemas/lista.schema.js";

export async function validateLista(req, res, next) {
    try {
        const datosValidados = await listaSchema.validate(req.body, {
            abortEarly: false, 
            stripUnknown: true, 
        });

        req.body = datosValidados; 
        next();
    } catch (error) {
        res.status(400).json({ message: error.errors });
    }
}

