import { MongoClient } from "mongodb"

const cliente = new MongoClient("mongodb+srv://martinarepossi:admin@cluster-ah-final.19ges.mongodb.net/")

cliente.connect()
    .then( () => console.log("Me conecte!") )
    .catch( () => console.log("No me pude conectar") )
const db = cliente.db("AH2024")

async function consulta(){
    console.log("Consultado Datos")
    const datos = await db.collection("Tableros").find().toArray()
    console.log(datos)
}

consulta()

