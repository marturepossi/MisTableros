import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css"; 
import Layout from "./components/layout/Layout.jsx";
import Home from "./components/Home.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";


const ListadoTableros = React.lazy(() => import("./components/Tableros.jsx"));
const TableroDetalle = React.lazy(() => import("./components/TableroDetalle.jsx"));
const Login = React.lazy(() => import("./components/Login.jsx"));
const Registro = React.lazy(() => import("./components/Register.jsx"));
const Perfil = React.lazy(() => import("./components/Perfil.jsx"));
const TodosTableros = React.lazy(() => import("./components/AllTableros.jsx"));

const router = createBrowserRouter([
  {
    element: <Layout />, 
    children: [
      {
        path: "/",
        element: (
            <Home />   
        ),
      },
      {
        path: "/login",
        element: (
          <React.Suspense fallback={<div>Cargando...</div>}>
            <Login />
          </React.Suspense>
        ),
      },
      {
        path: "/registro",
        element: (
          <React.Suspense fallback={<div>Cargando...</div>}>
            <Registro />
          </React.Suspense>
        ),
      },
      {
        path: "/perfil",
        element: (
          <React.Suspense fallback={<div>Cargando...</div>}>
            <Perfil />
          </React.Suspense>
        ),
      },
      {
        path: "/tablero",
        element: (
     
          <React.Suspense fallback={<div>Cargando...</div>}>
            <ListadoTableros />
          </React.Suspense>
         
        ),
      },
      {
        path: "/tablero/:id",
        element: (
          
          <React.Suspense fallback={<div>Cargando...</div>}>
            <TableroDetalle />
          </React.Suspense>
          
        ),
      },
      {
        path: "/todos",
        element: (
          
          <React.Suspense fallback={<div>Cargando...</div>}>
            <TodosTableros />
          </React.Suspense>
          
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

