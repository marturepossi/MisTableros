import * as service from "../../services/listas.service.js";
import { ObjectId } from "mongodb"; // Importar ObjectId
// Obtener todas las listas de un tablero
function getListas(req, res) {
    const tableroId = req.params.tableroId;

    if (!tableroId) {
        return res.status(400).json({ message: "El ID del tablero es obligatorio" });
    }

    service.getListasByTablero(tableroId)
        .then((listas) => {
            res.status(200).json({
                name: "Nombre del Tablero", 
                listas,
            });
        })
        .catch((error) => {
            console.error("Error al obtener las listas:", error.message);
            res.status(500).json({ message: "Error al obtener las listas" });
        });
}

// Obtener una lista específica
function getListaById(req, res) {
    const listaId = req.params.listaId;
    service.getListaById(listaId)
        .then((lista) => {
            if (!lista) {
                return res.status(404).json({ message: "Lista no encontrada" });
            }
            res.status(200).json(lista);
        })
        .catch(() => res.status(500).json({ message: "Error al obtener la lista" }));
}

// Crear una nueva lista
function crearLista(req, res) {
    const tableroId = req.params.tableroId;
    const lista = {
        ...req.body,
        tableroId, // Asociar lista al tablero correspondiente
        tarjetas: [], //Toma a las tarjetas como un array vacío
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    service.createLista(tableroId, lista)
        .then((nuevaLista) => res.status(201).json(nuevaLista))
        .catch((error) => {
            console.error("Error al crear la lista:", error.message);
            res.status(500).json({ message: "Error al crear la lista" });
        });
}

// Actualizar una lista
function actualizarLista(req, res) {
    const listaId = req.params.listaId;

    if (!ObjectId.isValid(listaId)) {
        return res.status(400).json({ message: "ID de lista no válido" });
    }

    const updates = req.body;

    service.updateLista(listaId, updates)
        .then((listaActualizada) => {
            if (!listaActualizada) {
                return res.status(404).json({ message: "Lista no encontrada" });
            }
            res.status(200).json(listaActualizada);
        })
        .catch((error) => {
            console.error("Error al actualizar la lista:", error.message);
            res.status(500).json({ message: "Error en el servidor", error: error.message });
        });
}



// Eliminar una lista
function borrarLista(req, res) {
    const listaId = req.params.listaId;
    const tableroId = req.params.tableroId;
    service.deleteLista(tableroId, listaId)
        .then(() => res.status(204).end())
        .catch(() => res.status(404).json({ message: "Lista no encontrada" }));
}

export {
    getListas,
    getListaById,
    crearLista,
    actualizarLista,
    borrarLista
};
