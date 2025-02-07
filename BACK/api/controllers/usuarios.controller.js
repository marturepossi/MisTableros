import * as service from "../../services/usuarios.service.js";

// Obtener lista de usuarios con filtros opcionales
function getUsuarios(req, res) {
    const filtros = req.query;
    service.getUsuarios(filtros)
        .then((usuarios) => res.status(200).json(usuarios))
        .catch(() => res.status(500).json({ mensaje: "Error al obtener usuarios" }));
}

// Agregar un nuevo usuario
function agregarUsuario(req, res) {
    const { email, password, name, company, description, imagen } = req.body;

    if (!email || !password || !name || !company) {
        return res.status(400).json({ mensaje: "Campos obligatorios: email, password, name, company" });
    }

    const usuario = { email, password, name, company, description, imagen };

    service.agregarUsuario(usuario)
        .then((usuarioCreado) => res.status(201).json(usuarioCreado))
        .catch(() => res.status(404).json({ mensaje: "No se pudo agregar el usuario" }));
}

// Eliminar un usuario por ID
function borrarUsuario(req, res) {
    const id = req.params.id;
    service.borrarUsuario(id)
        .then(() => res.status(204).json({ mensaje: "Usuario eliminado" }))
        .catch(() => res.status(404).json({ mensaje: "No se pudo eliminar el usuario" }));
}

// Actualizar un usuario completamente (PUT)
function actualizarUsuario(req, res) {
    const id = req.params.id;
    const { email, password, name, company, description, imagen } = req.body;

    if (!email || !password || !name || !company) {
        return res.status(400).json({ mensaje: "Campos obligatorios: email, password, name, company" });
    }

    const nuevosDatos = { email, password, name, company, description, imagen };

    service.actualizarUsuario(id, nuevosDatos)
        .then((usuarioActualizado) => res.status(200).json(usuarioActualizado))
        .catch(() => res.status(404).json({ mensaje: "No se pudo actualizar el usuario" }));
}

// Actualizar parcialmente un usuario (PATCH)
function actualizarParcialUsuario(req, res) {
    const id = req.params.id;
    const datosParciales = req.body;

    
    if (Object.keys(datosParciales).length === 0) {
        return res.status(400).json({ mensaje: "Debe enviar al menos un campo para actualizar" });
    }

    service.actualizarParcialUsuario(id, datosParciales)
        .then(() => service.getUsuarioPorId(id)) 
        .then((usuarioActualizado) => {
            if (!usuarioActualizado) {
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }
            res.status(200).json(usuarioActualizado); //Devuelvo al usario actualziado
        })
        .catch((error) => {
            console.error("Error al actualizar parcialmente el usuario:", error.message);
            res.status(500).json({ mensaje: "Error al actualizar el usuario" });
        });
}

// Inicio de sesión del usuario
function login(req, res) {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return res.status(400).json({ mensaje: "Email y password son obligatorios" });
    }

    service.login({ email, password })
        .then((usuario) => res.status(200).json(usuario))
        .catch((error) => res.status(400).json({ mensaje: error.message }));
}


function getUsuarioPorId(req, res) {
    const id = req.params.id;
    service.getUsuarioPorId(id)
        .then((usuario) => res.status(200).json(usuario))
        .catch(() => res.status(404).json({ mensaje: "Usuario no encontrado" }));
}

function actualizarImagenUsuario(req, res) {
    const id = req.params.id;

    if (!req.file) {
        return res.status(400).json({ mensaje: "No se ha proporcionado una imagen" });
    }

    const nuevaImagen = `/uploads/${req.file.filename}`;

    service
        .actualizarParcialUsuario(id, { imagen: nuevaImagen })
        .then(() => service.getUsuarioPorId(id))
        .then((usuarioActualizado) => {
            if (!usuarioActualizado) {
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }
            res.status(200).json(usuarioActualizado);
        })
        .catch((error) => {
            console.error("Error al actualizar la imagen del usuario:", error.message);
            res.status(500).json({ mensaje: "Error al actualizar la imagen", error });
        });
}

export{
    getUsuarios,
    agregarUsuario,
    borrarUsuario,
    actualizarUsuario,
    actualizarParcialUsuario,
    login,
    getUsuarioPorId,
    actualizarImagenUsuario,
}
