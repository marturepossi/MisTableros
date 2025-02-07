import { validateToken as verificarToken } from "../services/token.service.js";

export async function validateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    console.log("Auth Header recibido:", authHeader);

    try {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token no proporcionado o formato inválido" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Token extraído:", token);
        const usuario = await verificarToken(token);
        console.log("Token validado correctamente, usuario:", usuario);

        req.userId = usuario._id;
        next(); 
    } catch (error) {
        console.error("Error en la validación del token:", error.message);
        res.status(401).json({ message: error.message || "No autorizado" });
    }
}
