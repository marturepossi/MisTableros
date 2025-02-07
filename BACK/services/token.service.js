import { MongoClient, ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

const cliente = new MongoClient("mongodb+srv://martinarepossi:admin@cluster-ah-final.19ges.mongodb.net/");
const db = cliente.db("AH2024");
const tokens = db.collection("tokens")

const SECRET_KEY = "TABLERO"

export async function crearToken(usuario) {
    try {
        if (!usuario._id) {
            throw new Error("El usuario debe tener un _id");
        }

        const token = jwt.sign(
            { _id: usuario._id.toString(), email: usuario.email },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        await cliente.connect();
        await tokens.insertOne({ token, usuario_id: new ObjectId(usuario._id) });

        return token;
    } catch (error) {
        console.error("Error al crear el token:", error.message);
        throw error;
    }
}
export async function validateToken(token) {
    try {
        console.log("Validando token:", token);
        const payload = jwt.verify(token, SECRET_KEY);
        console.log("Payload decodificado:", payload);

        await cliente.connect();
        console.log("Conexión a la base de datos exitosa");
        if (!ObjectId.isValid(payload._id)) {
            throw new Error("El _id del token no es un ObjectId válido");
        }
        const session = await tokens.findOne({ token, usuario_id: new ObjectId(payload._id) });
        if (!session) {
            throw new Error("Sesión no válida o token no encontrado");
        }

        return payload; 
    } catch (error) {
        console.error("Error al validar el token:", error.message);
        throw new Error("No autorizado");
    }
}
