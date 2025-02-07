import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getTableros, createTablero, updateTablero, deleteTablero } from "../services/tableros.service";

const Tableros = () => {
  const [tableros, setTableros] = useState([]);
  const [filteredTableros, setFilteredTableros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const navigate = useNavigate();

  const categorias = ["General", "Marketing", "Diseño", "Negocios", "Educación"];
 
  useEffect(() => {
    const fetchTableros = async () => {
      try {
        const response = await getTableros();
        setTableros(response);
        setFilteredTableros(response);
      } catch (error) {
        Swal.fire("Error", "Error al obtener los tableros.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTableros();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "") {
      setFilteredTableros(tableros);
    } else {
      const filtered = tableros.filter((tablero) => tablero.category === category);
      setFilteredTableros(filtered);
    }
  };

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Nuevo Tablero",
      html: `
        <div style="text-align: left;">
          <label for="swal-input1" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Título del Tablero</label>
          <input id="swal-input1" placeholder="Escribe el título" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 15px;
          " />
  
          <label for="swal-input2" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Categoría</label>
          <select id="swal-input2" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 15px;
            background-color: #fff;
          ">
            ${categorias.map((cat) => `<option value="${cat}">${cat}</option>`).join("")}
          </select>
  
          <label for="swal-input3" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Agregar Imagen</label>
          <button id="image-button" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 40px;
            border: 1px dashed #ccc;
            border-radius: 5px;
            background: #f9f9f9;
            cursor: pointer;
            font-size: 16px;
            color: #666;
          ">
            <span style="font-size: 18px; margin-right: 8px;">+</span> Cargar Imagen
          </button>
          <input type="file" id="swal-input3" style="display: none;" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      didOpen: () => {
        const imageButton = document.getElementById("image-button");
        const fileInput = document.getElementById("swal-input3");
  
        imageButton.addEventListener("click", () => {
          fileInput.click();
        });
  
        fileInput.addEventListener("change", () => {
          if (fileInput.files.length > 0) {
            imageButton.innerHTML = `<span style="font-size: 14px; color: #666;">Imagen cargada: ${fileInput.files[0].name}</span>`;
          }
        });
      },
      preConfirm: () => {
        const name = document.getElementById("swal-input1").value;
        const category = document.getElementById("swal-input2").value;
        const file = document.getElementById("swal-input3").files[0];
        if (!name || !category) {
          Swal.showValidationMessage("El título y la categoría son obligatorios");
          return null;
        }
        return { name, category, file };
      },
    });
  
    if (formValues) {
      try {
        const formData = new FormData();
        formData.append("name", formValues.name);
        formData.append("category", formValues.category);
        if (formValues.file) {
          formData.append("foto", formValues.file);
        }
  
        const newTablero = await createTablero(formData);
        setTableros((prev) => [...prev, newTablero]);
        setFilteredTableros((prev) => [...prev, newTablero]);
        setSelectedCategory("");
        Swal.fire("Éxito", "Tablero creado con éxito.", "success");
      } catch (error) {
        Swal.fire("Error", "Error al crear el tablero.", "error");
      }
    }
  };

  const handleEdit = async (tablero) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Tablero",
      html: `
        <div style="text-align: left;">
          <label for="swal-input1" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Título del Tablero</label>
          <input id="swal-input1" value="${tablero.name || ""}" placeholder="Escribe el nuevo título" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 15px;
          " />
  
          <label for="swal-input2" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Categoría</label>
          <select id="swal-input2" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 15px;
            background-color: #fff;
          ">
            ${categorias
              .map(
                (cat) =>
                  `<option value="${cat}" ${
                    tablero.category === cat ? "selected" : ""
                  }>${cat}</option>`
              )
              .join("")}
          </select>
  
          <label for="swal-input3" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Actualizar Imagen</label>
          <button id="image-button" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 40px;
            border: 1px dashed #ccc;
            border-radius: 5px;
            background: #f9f9f9;
            cursor: pointer;
            font-size: 16px;
            color: #666;
          ">
            <span style="font-size: 18px; margin-right: 8px;">+</span> Cargar Imagen
          </button>
          <input type="file" id="swal-input3" style="display: none;" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      didOpen: () => {
        const imageButton = document.getElementById("image-button");
        const fileInput = document.getElementById("swal-input3");
  
        imageButton.addEventListener("click", () => {
          fileInput.click();
        });
  
        fileInput.addEventListener("change", () => {
          if (fileInput.files.length > 0) {
            imageButton.innerHTML = `<span style="font-size: 14px; color: #666;">Imagen cargada: ${fileInput.files[0].name}</span>`;
          }
        });
      },
      preConfirm: () => {
        const name = document.getElementById("swal-input1").value;
        const category = document.getElementById("swal-input2").value;
        const file = document.getElementById("swal-input3").files[0];
  
        if (!name || !category) {
          Swal.showValidationMessage("El título y la categoría son obligatorios");
          return null;
        }
        return { name, category, file };
      },
    });
  
    if (formValues) {
      try {
        const formData = new FormData();
        formData.append("name", formValues.name);
        formData.append("category", formValues.category);
        if (formValues.file) {
          formData.append("foto", formValues.file);
        }
  
        const updatedTablero = await updateTablero(tablero._id, formData);
        setTableros((prev) =>
          prev.map((t) => (t._id === updatedTablero._id ? updatedTablero : t))
        );
        setFilteredTableros((prev) =>
          prev.map((t) => (t._id === updatedTablero._id ? updatedTablero : t))
        );
        setSelectedCategory("");
        Swal.fire("Éxito", "Tablero actualizado con éxito.", "success");
      } catch (error) {
        Swal.fire("Error", "Error al actualizar el tablero.", "error");
      }
    }
  };

  const handleDelete = async (tableroId) => {
    const result = await Swal.fire({
      title: "¿Eliminar Tablero?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteTablero(tableroId);
        setTableros((prev) => prev.filter((t) => t._id !== tableroId));
        setFilteredTableros((prev) => prev.filter((t) => t._id !== tableroId));
        setSelectedCategory("");
        Swal.fire("Eliminado", "El tablero ha sido eliminado.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el tablero.", "error");
      }
    }
  };

  const toggleMenu = (tableroId) => {
    setMenuOpen(menuOpen === tableroId ? null : tableroId);
  };

  const handleView = (tableroId) => {
    navigate(`/tablero/${tableroId}`);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Cargando tableros...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-left p-4">
      <div className="container mx-auto flex justify-between mb-6 items-center">
        {/* Título */}
        <h1 className="text-4xl font-bold">Mis Tableros</h1>
  
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
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTableros.map((tablero) => (
          <div
            key={tablero._id}
            onClick={() => handleView(tablero._id)}
            className="bg-white p-4 rounded shadow-md flex flex-col items-start cursor-pointer relative"
          >
            {/* Imagen */}
            <div className="relative w-full h-32">
              {tablero.foto ? (
                <img
                  src={`http://localhost:3333${tablero.foto}`}
                  alt={`Imagen de ${tablero.name}`}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-gray-400 rounded"
                  style={{ backgroundColor: tablero.color || "#f0f0f0" }}
                >
                  Sin Imagen
                </div>
              )}
            </div>
  
            {/* Menú de tres puntos */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(tablero._id);
              }}
              className="absolute top-2 right-2 cursor-pointer text-gray-600 bg-gray-200 flex items-center justify-center w-8 h-8 rounded hover:bg-gray-300"
            >
              ⋮
            </div>
            {menuOpen === tablero._id && (
              <div
                className="absolute top-12 right-2 bg-white shadow-lg rounded z-10"
                onMouseLeave={() => setMenuOpen(null)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(null);
                    handleEdit(tablero);
                  }}
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(null);
                    handleDelete(tablero._id);
                  }}
                  className="block px-4 py-2 text-sm text-red-800 hover:bg-gray-100"
                >
                  Eliminar
                </button>
              </div>
            )}
  
            {/* Nombre y Categoría */}
            <h3 className="text-lg font-semibold mt-2">{tablero.name}</h3>
            <p className="text-sm text-gray-600">{tablero.category}</p>
          </div>
        ))}
  
        <button
          onClick={handleCreate}
          className="bg-gray-200 p-4 rounded-md shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300"
        >
          <div className="text-center">
            <span className="text-3xl font-semibold text-gray-400">+</span>
            <p className="text-gray-600 mt-2">Crear Tablero</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Tableros;