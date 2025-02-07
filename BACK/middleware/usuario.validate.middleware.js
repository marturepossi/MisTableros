import { usuarioSchema } from "../schemas/usuario.schema.js";

export async function validateUsuario(req, res, next) {
    try {
       
        const datosValidados = await usuarioSchema.validate(req.body, {
            abortEarly: false, 
            stripUnknown: true, 
        });

    
        req.body = datosValidados;

        next(); 
    } catch (error) {
        
        res.status(400).json({ 
            message: "Errores de validación",
            errors: error.errors, 
        });
    }
}
