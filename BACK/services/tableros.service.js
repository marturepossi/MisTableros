import { MongoClient, ObjectId } from "mongodb";

const cliente = new MongoClient("mongodb+srv://martinarepossi:admin@cluster-ah-final.19ges.mongodb.net/");
const db = cliente.db("AH2024");

// Obtener un tablero por su ID
async function getTableroById(id) {
    try {
      console.log("Conectando a la base de datos...");
      await cliente.connect();
  
      if (!ObjectId.isValid(id)) {
        console.error("ID proporcionado no es válido:", id);
        throw new Error("El ID proporcionado no es un ObjectId válido.");
      }
  
      console.log("Buscando tablero con ID:", id);
      const tablero = await db.collection("Tableros").findOne({ _id: new ObjectId(id) });
      if (!tablero) {
        console.warn("No se encontró el tablero con ID:", id);
        return null;
      }
  
      console.log("Tablero encontrado:", tablero);
  
      console.log("Buscando listas asociadas...");
      const listas = await db.collection("Listas").find({ tableroId: new ObjectId(id) }).toArray();
      console.log("Listas encontradas:", listas);
  
      for (const lista of listas) {
        console.log("Buscando tarjetas para lista con ID:", lista._id);
        const tarjetas = await db.collection("Tarjetas").find({ listId: lista._id }).toArray();
        lista.tarjetas = tarjetas;
      }
      console.log("Buscando detalles de los miembros...");
      const miembros = await db.collection("usuarios").find({
        _id: { $in: tablero.miembros.map((id) => new ObjectId(id)) },
      }).toArray();
  
      console.log("Miembros encontrados:", miembros);
  
      return { ...tablero, listas, miembros };
    } catch (error) {
      console.error("Error en getTableroById:", error.message);
      throw error;
    } finally {
      console.log("Cerrando conexión a la base de datos...");
      await cliente.close();
    }
  }

// Crear un nuevo tablero
async function createTablero(tablero) {
  try {
      await cliente.connect();

      const nuevoTablero = {
          ...tablero,
          miembros: [tablero.creator], 
          foto: tablero.foto || null,
          category: tablero.category || "General", 
          status: "En curso",
          createdAt: new Date(),
          updatedAt: new Date(),
      };

      const result = await db.collection("Tableros").insertOne(nuevoTablero);
      const tableroId = result.insertedId;

      const listas = [
          { title: "To Do", tarjetas: [], tableroId: new ObjectId(tableroId) },
          { title: "In Progress", tarjetas: [], tableroId: new ObjectId(tableroId) },
          { title: "Done", tarjetas: [], tableroId: new ObjectId(tableroId) },
      ];

      await db.collection("Listas").insertMany(listas);

      return { ...nuevoTablero, _id: tableroId };
  } catch (error) {
      throw error;
  } finally {
      await cliente.close();
  }
}


// Eliminar un tablero por su ID
async function deleteTablero(id) {
  await cliente.connect();

  // Eliminalisats relacioandas
  await db.collection("Listas").updateMany(
      { tableroId: new ObjectId(id) },
      { $set: { eliminado: true, updatedAt: new Date() } }
  );
  // Marca el tablero como eliminado
  const result = await db.collection("Tableros").updateOne(
      { _id: new ObjectId(id) },
      { $set: { eliminado: true, updatedAt: new Date() } }
  );

  return result; 
}

//Actualizar completamente un tablero
async function replaceTablero(id, tablero) {
  await cliente.connect();
  const result = await db.collection("Tableros").replaceOne(
      { _id: new ObjectId(id) },
      {
          ...tablero,
          foto: tablero.foto || null,
          category: tablero.category || "General",
          updatedAt: new Date(),
      }
  );
  return result;
}

// Actualizar parcialmente un tablero
async function updateTablero(id, updates) {
  try {
      await cliente.connect();

      console.log("Actualizando tablero con datos:", updates);

      const result = await db.collection("Tableros").updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...updates, updatedAt: new Date() } }
      );

      console.log("Resultado de la actualización:", result);

      if (result.matchedCount === 0) {
          console.warn("Tablero no encontrado para actualizar:", id);
          return null;
      }

      const tableroActualizado = await db.collection("Tableros").findOne({ _id: new ObjectId(id) });
      console.log("Tablero actualizado en la base de datos:", tableroActualizado);

      return tableroActualizado;
  } catch (error) {
      console.error("Error al actualizar el tablero en la base de datos:", error);
      throw error;
  } finally {
      await cliente.close();
  }
}

// Agregar un miembro a un tablero por email
async function addMemberToTableroByEmail(tableroId, email) {
  await cliente.connect();

  const usuario = await db.collection("usuarios").findOne({ email, eliminado: { $ne: true } });

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  const tablero = await db.collection("Tableros").findOne({ _id: new ObjectId(tableroId) });

  if (!tablero) {
    throw new Error("Tablero no encontrado");
  }

  if (tablero.miembros.includes(usuario._id.toString())) {
    throw new Error("El usuario ya es miembro del tablero");
  }

  const result = await db.collection("Tableros").updateOne(
    { _id: new ObjectId(tableroId) },
    {
      $addToSet: { miembros: usuario._id.toString() },
      $set: { updatedAt: new Date() },
    }
  );

  return { tableroId, miembro: usuario._id };
}

async function getTablerosbyUser(filter) {
  await cliente.connect();

  const filtroConEliminados = {
    ...filter,
    eliminado: { $ne: true }, // No tableros eliminados
  };

  return db.collection("Tableros").find(filtroConEliminados).toArray();
}

async function getTableros() {
  await cliente.connect();

  return db.collection("Tableros")
    .find({ eliminado: { $ne: true } }) // ENo tableros eliminados
    .toArray();
}

export {
  getTableros,
    getTablerosbyUser,
    getTableroById,
    createTablero,
    deleteTablero,
    replaceTablero,
    updateTablero,
    addMemberToTableroByEmail,
};

export default {
    getTablerosbyUser,
    getTableroById,
    createTablero,
    deleteTablero,
    replaceTablero,
    updateTablero,
    addMemberToTableroByEmail,
};
