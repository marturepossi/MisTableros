import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllTableros } from "../services/tableros.service";

const TodosTableros = () => {
  const [tableros, setTableros] = useState([]);
  const [filteredTableros, setFilteredTableros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const categorias = ["General", "Marketing", "Diseño", "Negocios", "Educación"];

  useEffect(() => {
    const fetchAllTableros = async () => {
      try {
        const response = await getAllTableros();
        setTableros(response);
        setFilteredTableros(response); // Muestro todos los tableros 
      } catch (error) {
        console.error("Error al obtener todos los tableros:", error.message);
        Swal.fire("Error", "Error al cargar los tableros.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAllTableros();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === "") {
      setFilteredTableros(tableros); // Muestro los seleccionados
    } else {
      const filtered = tableros.filter((tablero) => tablero.category === category);
      setFilteredTableros(filtered);
    }
  };

  const handleViewTablero = (tableroId) => {
    navigate(`/tablero/${tableroId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando tableros...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        {/* Título */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-4xl font-bold mb-4 md:mb-0">Plantillas</h1>

          {/* Filtro de categoría como menú */}
          <div className="flex gap-4">
            <button
              onClick={() => handleCategoryChange("")}
              className={`px-4 py-2 rounded font-semibold text-sm ${
                selectedCategory === ""
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Todos
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => handleCategoryChange(categoria)}
                className={`px-4 py-2 rounded font-semibold text-sm ${
                  selectedCategory === categoria
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Contenedor de Tableros */}
        {filteredTableros.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTableros.map((tablero) => (
              <div
                key={tablero._id}
                className="bg-white p-4 rounded shadow-md flex flex-col cursor-pointer"
                onClick={() => handleViewTablero(tablero._id)}
              >
                {/* Imagen o Placeholder */}
                <div className="relative w-full h-32">
                  {tablero.foto ? (
                    <img
                      src={`http://localhost:3333${tablero.foto}`}
                      alt={`Imagen de ${tablero.name}`}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-gray-400"
                      style={{ backgroundColor: tablero.color || "#f0f0f0" }}
                    >
                      Sin Imagen
                    </div>
                  )}
                </div>
                {/* Nombre y Categoría */}
                <h3 className="text-lg font-semibold mt-2">{tablero.name}</h3>
                <p className="text-sm text-gray-600">{tablero.category}</p>
               
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-6">
            No se han encontrado tableros para esta categoría.
          </p>
        )}
      </div>
    </div>
  );
};

export default TodosTableros;