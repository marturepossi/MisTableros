import { MongoClient } from "mongodb";

// URL de conexión y base de datos
const cliente = new MongoClient("mongodb+srv://admin:admin@trello.rzjok.mongodb.net/");
const db = cliente.db("tablero");

async function testInsert() {
    try {
        await cliente.connect();
        const tokens = db.collection("tokens");

        const result = await tokens.insertOne({
            token: "test-token",
            usuario_id: "test-user-id",
            createdAt: new Date()
        });

        console.log("Inserción exitosa:", result);
    } catch (error) {
        console.error("Error al insertar en la colección de tokens:", error);
    } finally {
        await cliente.close();
    }
}

testInsert();
