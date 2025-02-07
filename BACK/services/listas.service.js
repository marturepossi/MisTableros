import { MongoClient, ObjectId } from "mongodb";

const cliente = new MongoClient("mongodb+srv://martinarepossi:admin@cluster-ah-final.19ges.mongodb.net/");
const db = cliente.db("AH2024");


// Obtener todas las listas de un tablero
async function getListasByTablero(tableroId) {
    try {
        await cliente.connect();

        
        const listas = await db.collection("Listas").find({ tableroId: new ObjectId(tableroId) }).toArray();

        
        for (const lista of listas) {
            const tarjetas = await db.collection("Tarjetas").find({ listId: lista._id }).toArray();
            lista.tarjetas = tarjetas; 
        }

        return listas;
    } catch (error) {
        console.error("Error en getListasByTablero:", error.message);
        throw error;
    } finally {
        await cliente.close();
    }
}

// Obtener una lista específica
async function getListaById(id) {
    try {
        await cliente.connect();
        const lista = await db.collection("Listas").findOne({ _id: new ObjectId(id) });
        if (!lista) return null;
        const tarjetas = await db.collection("Tarjetas").find({ listId: new ObjectId(id) }).toArray();

        return { ...lista, tarjetas };
    } catch (error) {
        console.error("Error en getListaById:", error.message);
        throw error;
    } finally {
        await cliente.close();
    }
}

// Crear una nueva lista
async function createLista(tableroId, lista) {
    const nuevaLista = {
        ...lista,
        tableroId: new ObjectId(tableroId),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await cliente.connect();
    const result = await db.collection("Listas").insertOne(nuevaLista);
    return { ...nuevaLista, _id: result.insertedId };
    
}

// Actualizar una lista
async function updateLista(listaId, updates) {
    if (!ObjectId.isValid(listaId)) {
        throw new Error("ID de lista no válido");
    }

    await cliente.connect();

    const result = await db.collection("Listas").findOneAndUpdate(
        { _id: new ObjectId(listaId) },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: "after" } // Devuelve lisat actualizada. No se me actualziaba sino por esto, loq eu sigue...
    );
    if (!result.value) {
        const updatedLista = await db.collection("Listas").findOne({ _id: new ObjectId(listaId) });
        if (!updatedLista) {
            throw new Error("Lista no encontrada");
        }
        return updatedLista; // Devuelve el documento actualizado
    }
    return result.value;
}

// Eliminar una lista
async function deleteLista(tableroId, listaId) {
    await cliente.connect();
    await db.collection("Listas").deleteOne({ _id: new ObjectId(listaId) });
    await db.collection("Tableros").updateOne(
        { _id: new ObjectId(tableroId) },
        { $pull: { lists: new ObjectId(listaId) }, $set: { updatedAt: new Date() } }
    );
}

export {
    getListasByTablero,
    getListaById,
    createLista,
    updateLista,
    deleteLista
};
