import * as service from "../../services/tarjetas.service.js";
import { ObjectId } from "mongodb"; // Importar ObjectId

// Obtener todas las tarjetas de una lista
function getTarjetas(req, res) {
    const listId = req.params.listId;

    service.getTarjetasByList(listId)
        .then((tarjetas) => res.status(200).json(tarjetas))
        .catch((error) => {
            console.error("Error al obtener las tarjetas:", error.message);
            res.status(500).json({ message: "Error al obtener las tarjetas" });
        });
}
function getTarjetaById(req, res) {
    const tarjetaId = req.params.tarjetaId;
    service.getTarjetasById(tarjetaId)
        .then((tarjeta) => {
            if (!tarjeta) {
                return res.status(404).json({ message: "Tarjeta no encontrada" });
            }
            res.status(200).json(tarjeta);
        })
        .catch(() => res.status(500).json({ message: "Error al obtener la tarjeta" }));
}

// Crear una nueva tarjeta
function crearTarjeta(req, res) {
    const { title, description, priority, dueDate, listId } = req.body;

    console.log("Datos recibidos para crear tarjeta:", { title, description, priority, dueDate, listId });

    service.createTarjeta({ title, description, priority, dueDate, listId })
        .then((nuevaTarjeta) => res.status(201).json(nuevaTarjeta))
        .catch((error) => {
            console.error("Error al crear la tarjeta:", error.message);
            res.status(500).json({ message: "Error interno al crear la tarjeta" });
        });
}

// Actualizar una tarjeta
function actualizarTarjeta(req, res) {
    const tarjetaId = req.params.tarjetaId;
    const updates = req.body;
  
    console.log("ID de la tarjeta recibido en el controlador:", tarjetaId);
    console.log("Datos enviados para actualizar:", updates);
  
    service
      .updateTarjeta(tarjetaId, updates)
      .then((tarjetaActualizada) => {
        if (!tarjetaActualizada) {
          console.error("Tarjeta no encontrada con ID:", tarjetaId);
          return res.status(404).json({ message: "Tarjeta no encontrada" });
        }
        console.log("Tarjeta actualizada exitosamente:", tarjetaActualizada);
        res.status(200).json(tarjetaActualizada); 
      })
      .catch((error) => {
        console.error("Error al actualizar la tarjeta:", error.message);
        res.status(500).json({ message: "Error interno al actualizar la tarjeta" });
      });
  }
  

  

// Eliminar una tarjeta
function borrarTarjeta(req, res) {
    const tarjetaId = req.params.tarjetaId;

    service.deleteTarjeta(tarjetaId)
        .then(() => res.status(204).end())
        .catch((error) => {
            console.error("Error al eliminar la tarjeta:", error.message);
            res.status(404).json({ message: "Tarjeta no encontrada" });
        });
}

export {
    getTarjetas,
    getTarjetaById,
    crearTarjeta,
    actualizarTarjeta,
    borrarTarjeta,
};
