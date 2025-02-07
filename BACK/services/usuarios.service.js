import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { crearToken } from "./token.service.js";

const cliente = new MongoClient("mongodb+srv://martinarepossi:admin@cluster-ah-final.19ges.mongodb.net/");
const db = cliente.db("AH2024");

export async function getUsuarios() {
    await cliente.connect();
    return db.collection("usuarios").find({ eliminado: { $ne: true } }).toArray();
}

export async function agregarUsuario(usuario) {
    await cliente.connect();

    const existe = await db.collection("usuarios").findOne({ email: usuario.email });

    if (existe) {
        throw new Error("Cuenta Ya Existe");
    }

    const usuarioNuevo = { ...usuario };
    usuarioNuevo.password = await bcrypt.hash(usuario.password, 10);
    usuarioNuevo.description = usuario.description || null; 
    usuarioNuevo.imagen = usuario.imagen || null; 

    await db.collection("usuarios").insertOne(usuarioNuevo);

    return usuarioNuevo;
}

export async function borrarUsuario(id) {
    await cliente.connect();
    return db
        .collection("usuarios")
        .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: { eliminado: true } });
}

export async function actualizarUsuario(id, nuevosDatos) {
    await cliente.connect();

    if (nuevosDatos.password) {
        nuevosDatos.password = await bcrypt.hash(nuevosDatos.password, 10);
    }

    return db
        .collection("usuarios")
        .updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: nuevosDatos }
        );
}


export async function actualizarParcialUsuario(id, datosParciales) {
    await cliente.connect();

    if (datosParciales.password) {
        datosParciales.password = await bcrypt.hash(datosParciales.password, 10);
    }

    return db
        .collection("usuarios")
        .updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: datosParciales }
        );
}

export async function getUsuarioPorId(id) {
    await cliente.connect();
    return db
        .collection("usuarios")
        .findOne({ _id: ObjectId.createFromHexString(id), eliminado: { $ne: true } }); 
}


export async function login(usuario) {
    await cliente.connect();

    const existe = await db.collection("usuarios").findOne({ email: usuario.email });

    if (!existe) {
        throw new Error("No me pude loguear");
    }

    const esValido = await bcrypt.compare(usuario.password, existe.password);

    if (!esValido) {
        throw new Error("No me pude loguear");
    }

    const token = await crearToken(existe);

    return { ...existe, token: token, password: undefined };
}
