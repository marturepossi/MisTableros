import { MongoClient, ObjectId } from "mongodb";

const cliente = new MongoClient("mongodb+srv://martinarepossi:admin@cluster-ah-final.19ges.mongodb.net/");
const db = cliente.db("AH2024");

// Obtener todas las tarjetas de una lista
async function getTarjetasByList(listId) {
    try {
        console.log("listId recibido en servicio:", listId);

        if (!ObjectId.isValid(listId)) {
            throw new Error(`El listId proporcionado (${listId}) no es un ObjectId válido`);
        }
        await cliente.connect();
        const tarjetas = await db.collection("Tarjetas").find({ listId: new ObjectId(listId) }).toArray();

        console.log("Tarjetas encontradas en servicio:", tarjetas);
        return tarjetas;
    } catch (error) {
        console.error("Error en getTarjetasByList:", error.message);
        throw error;
    }
}
async function getTarjetaById(tarjetaId) {
    await cliente.connect();
    return db.collection("Tarjetas").findOne({ _id: new ObjectId(tarjetaId) });
}
async function updateTarjeta(tarjetaId, updates) {
    if (!ObjectId.isValid(tarjetaId)) {
        throw new Error(`El ID proporcionado (${tarjetaId}) no es válido`);
    }

    await cliente.connect();

    const updateResult = await db.collection("Tarjetas").updateOne(
        { _id: new ObjectId(tarjetaId) },
        { $set: { ...updates, updatedAt: new Date() } }
    );

    if (updateResult.matchedCount === 0) {
        throw new Error(`No se encontró una tarjeta con el ID ${tarjetaId}`);
    }

    const updatedTarjeta = await db.collection("Tarjetas").findOne({ _id: new ObjectId(tarjetaId) });
    if (!updatedTarjeta) {
        throw new Error(`Error al recuperar la tarjeta actualizada con el ID ${tarjetaId}`);
    }

    return updatedTarjeta; 
}

// Eliminar una tarjeta
async function deleteTarjeta(tarjetaId) {
    await cliente.connect();
    return db.collection("Tarjetas").deleteOne({ _id: new ObjectId(tarjetaId) });
}

async function createTarjeta({ title, description, priority, dueDate, listId }) {
    const nuevaTarjeta = {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        listId: new ObjectId(listId),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.collection("Tarjetas").insertOne(nuevaTarjeta);
    return { ...nuevaTarjeta, _id: result.insertedId };
}

export {
    getTarjetasByList,
    getTarjetaById,
    createTarjeta,
    updateTarjeta,
    deleteTarjeta,
};
