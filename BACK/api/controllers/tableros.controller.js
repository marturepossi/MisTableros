import * as service from "../../services/tableros.service.js";

function getTablerosbyUser(req, res) {
    const userId = req.userId; 
    const { category } = req.query; // Bsuco la category de la cosnulta

    const filterMongo = {
        $and: [
            { $or: [{ creator: userId }, { miembros: { $in: [userId] } }] },
            ...(category ? [{ category }] : []), 
        ],
    };

    service.getTablerosbyUser(filterMongo)
        .then((tableros) => res.status(200).json(tableros))
        .catch(() => res.status(500).json({ message: "Error al obtener los tableros" }));
}

function getTableroId(req, res) {
    const id = req.params.id;
  
    console.log("Recibiendo solicitud para el tablero con ID:", id);
  
    service.getTableroById(id)
      .then((tablero) => {
        if (!tablero) {
          console.log("Tablero no encontrado para ID:", id);
          return res.status(404).json({ message: "Tablero no encontrado" });
        }
        console.log("Tablero encontrado:", tablero);
        res.status(200).json(tablero);
      })
      .catch((error) => {
        console.error("Error al obtener el tablero:", error.message);
        res.status(500).json({ message: "Error interno al obtener el tablero" });
      });
  }
  
// Crear un nuevo tablero
function crearTablero(req, res) {
    try {
        console.log("Datos recibidos:", req.body);
        console.log("Archivo recibido:", req.file);

        const tablero = { 
            ...req.body,
            creator: req.userId,
            foto: req.file ? `/uploads/${req.file.filename}` : null,
            category: req.body.category,
            miembros: [req.userId],
        };

        service.createTablero(tablero)
            .then((nuevoTablero) => res.status(201).json(nuevoTablero))
            .catch((err) => {
                console.error("Error al crear el tablero:", err.message);
                res.status(500).json({ message: "Error al crear el tablero" });
            });
    } catch (error) {
        console.error("Error en el controlador:", error.message);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}

// Borrar tablero
function borrarTablero(req, res) {
  const id = req.params.id;
  service.deleteTablero(id)
      .then((resultado) => {
          if (!resultado.matchedCount) {
              return res.status(404).json({ message: "Tablero no encontrado" });
          }
          res.status(200).json({ message: "Tablero marcado como eliminado" });
      })
      .catch((error) => res.status(500).json({ message: "Error al eliminar el tablero", error }));
}

// Reemplazar un tablero completamente
function reemplazarTablero(req, res) {
  const id = req.params.id;
  const tablero = req.body;
  service.replaceTablero(id, tablero)
      .then((nuevoTablero) => {
          if (!nuevoTablero.matchedCount) {
              return res.status(404).json({ message: "Tablero no encontrado" });
          }
          return res.status(200).json(nuevoTablero);
      })
      .catch((error) => res.status(500).json({ message: "Error en el servidor", error }));
}

// Actualizar parcialmente un tablero
function actualizarTablero(req, res) {
    const id = req.params.id;
    const updates = req.body;

    if (req.file) {
        updates.foto = `/uploads/${req.file.filename}`;
    }

    console.log("Datos recibidos para actualizar:", updates);

    service.updateTablero(id, updates)
        .then((tableroActualizado) => {
            if (!tableroActualizado) {
                return res.status(404).json({ message: "Tablero no encontrado" });
            }
            res.status(200).json(tableroActualizado);
        })
        .catch((error) => {
            console.error("Error en el controlador al actualizar el tablero:", error);
            res.status(500).json({ message: "Error en el servidor" });
        });
}
// Agregar miembro a un tablero usando el email
function agregarMiembroPorEmail(req, res) {
    const tableroId = req.params.id;
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Se requiere el email del miembro" });
    }
  
    service.addMemberToTableroByEmail(tableroId, email)
      .then(({ tableroId, miembro }) => {
        res.status(200).json({
          message: "Miembro agregado exitosamente",
          tableroId,
          miembro,
        });
      })
      .catch((error) => {
        let status = 500;
        let message = "Error al agregar miembro";
  
        if (error.message === "Usuario no encontrado") {
          status = 404;
          message = "El email no corresponde a un usuario registrado";
        } else if (error.message === "Tablero no encontrado") {
          status = 404;
          message = "Tablero no encontrado";
        } else if (error.message === "El usuario ya es miembro del tablero") {
          status = 400;
          message = "El usuario ya es miembro del tablero";
        }
  
        res.status(status).json({ message });
      });
  }
  function getTableros(req, res) {
    service.getTableros()
      .then((tableros) => res.status(200).json(tableros))
      .catch((error) => {
        console.error("Error al obtener todos los tableros:", error.message);
        res.status(500).json({ message: "Error al obtener todos los tableros" });
      });
  }

  
export {
    getTableros,
    getTablerosbyUser,
    getTableroId,
    crearTablero,
    borrarTablero,
    reemplazarTablero,
    actualizarTablero,
    agregarMiembroPorEmail
};
