import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useToken, useLogout } from "../contexts/session.context";

const Navbar = () => {
    const location = useLocation();
    const token = useToken();
    const logout = useLogout();

    const hiddenRoutes = [];
    if (hiddenRoutes.includes(location.pathname)) {
        return null;
    }

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-white text-xl font-bold">
                        Tableros.com
                    </Link>
                    <div className="hidden lg:flex lg:items-center lg:space-x-4">
                        <ul className="flex space-x-4">
                            {token ? (
                                <>
                                    <li>
                                        <Link
                                            to="/tablero"
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                isActive("/tablero")
                                                    ? "bg-gray-900 text-white font-bold"
                                                    : "text-gray-300 hover:text-white"
                                            }`}
                                        >
                                            Mis Tableros
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/perfil"
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                isActive("/perfil")
                                                    ? "bg-gray-900 text-white font-bold"
                                                    : "text-gray-300 hover:text-white"
                                            }`}
                                        >
                                            Mi Perfil
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/todos"
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                isActive("/todos")
                                                    ? "bg-gray-900 text-white font-bold"
                                                    : "text-gray-300 hover:text-white"
                                            }`}
                                        >
                                            Plantillas
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={logout}
                                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            to="/login"
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                isActive("/login")
                                                    ? "bg-gray-900 text-white font-bold"
                                                    : "text-gray-300 hover:text-white"
                                            }`}
                                        >
                                            Iniciar Sesión
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/registro"
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                isActive("/registro")
                                                    ? "bg-gray-900 text-white font-bold"
                                                    : "text-gray-300 hover:text-white"
                                            }`}
                                        >
                                            Registro
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/todos"
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                isActive("/todos")
                                                    ? "bg-gray-900 text-white font-bold"
                                                    : "text-gray-300 hover:text-white"
                                            }`}
                                        >
                                            Plantillas
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;