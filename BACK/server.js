import express from "express";
import cors from "cors";

import TableroRoute from "./api/routes/tableros.routes.js"; 
import UsuarioRoute from "./api/routes/usuarios.routes.js"; 
import ListaRoute from "./api/routes/listas.routes.js";
import TarjetaRoute from "./api/routes/tarjetas.routes.js";


import http from "http";
import { Server as SocketIO } from "socket.io";

// Crear la aplicación y el servidor
const app = express();
const server = http.createServer(app);

// Configurar Socket.IO
const io = new SocketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
});

// Manejar eventos de conexión y mensajes
io.on("connection", (socket) => {
    console.log("Usuario conectado!");
    socket.on("mensaje", (dato) => {
        console.log("Mensaje recibido:", dato);
    });
});

// Configuración de CORS
const corsOptions = {
    origin: "http://localhost:5173", // Cambia según el frontend
    methods: "GET, POST , PUT, PATCH, DELETE"
};
app.use(cors(corsOptions));

// Middleware para parsear datos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static("uploads"));
// Rutas principales
app.use("/api/", TableroRoute); 
app.use("/api/", UsuarioRoute); 
app.use("/api/", ListaRoute);
app.use("/api/", TarjetaRoute);



// Iniciar el servidor
server.listen(3333, () => console.log("Servidor corriendo en el puerto 3333"));
