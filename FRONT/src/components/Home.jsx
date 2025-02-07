import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center px-4">
      {/* Encabezado principal */}
      <h1 className="text-5xl font-bold text-blue-700 mb-6">
        Bienvenido a Tableros.com
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
        Organiza tus proyectos y tareas de forma simple y eficiente. 
        Colabora con tu equipo y alcanza tus objetivos con Tableros.com, 
        tu herramienta favorita de gestión visual.
      </p>

      {/* Botones principales */}
      <div className="flex space-x-4 mb-12">
        <Link to="/login">
          <button className="bg-blue-500 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
            Login
          </button>
        </Link>
        <Link to="/registro">
          <button className="bg-green-500 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-200">
            Register
          </button>
        </Link>
      </div>

      {/* Beneficios clave */}
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          ¿Por qué usar Tableros.com?
        </h2>
        <ul className="text-gray-700 space-y-2">
          <li>✅ Gestiona proyectos de manera visual con tableros.</li>
          <li>✅ Colabora en tiempo real con tu equipo.</li>
          <li>✅ Organiza tareas con listas y tarjetas intuitivas.</li>
          <li>✅ Personaliza tu flujo de trabajo como lo necesites.</li>
        </ul>
      </div>

      {/* Vista previa de tableros */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Vista previa del tablero
        </h2>
        <div className="flex space-x-4 overflow-x-auto">
          {/* Lista de ejemplo */}
          <div className="w-1/3 bg-gray-200 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Pendientes</h3>
            <div className="bg-white p-2 rounded-md shadow-sm mb-2">
              Tarea 1
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm mb-2">
              Tarea 2
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              Tarea 3
            </div>
          </div>
          <div className="w-1/3 bg-gray-200 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">En Progreso</h3>
            <div className="bg-white p-2 rounded-md shadow-sm mb-2">
              Tarea 4
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              Tarea 5
            </div>
          </div>
          <div className="w-1/3 bg-gray-200 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Completadas</h3>
            <div className="bg-white p-2 rounded-md shadow-sm mb-2">
              Tarea 6
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              Tarea 7
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
