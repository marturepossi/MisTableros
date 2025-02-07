import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUsuario, updateUsuario, updateUsuarioImagen } from "../services/perfiles.service";


const Perfil = () => {
  const [usuario, setUsuario] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfilData = async () => {
      try {
        const usuarioId = localStorage.getItem("id");
  
        if (!usuarioId) {
          navigate("/login");
          return;
        }

        const usuarioData = await getUsuario(usuarioId);
        setUsuario(usuarioData);
      } catch (error) {
        console.error("Error al cargar el perfil:", error.message);
        Swal.fire("Error", "No se pudo cargar el perfil. Por favor, inicia sesión nuevamente.", "error");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPerfilData();
  }, []);

  const handleUploadImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("foto", file); 
    try {
        const usuarioId = localStorage.getItem("id");
        const updatedUsuario = await updateUsuarioImagen(usuarioId, formData);

        if (updatedUsuario) {
            setUsuario(updatedUsuario);
            Swal.fire("¡Éxito!", "Imagen actualizada correctamente.", "success");
        } else {
            Swal.fire("Error", "No se pudo actualizar la imagen.", "error");
        }
    } catch (error) {
        console.error("Error al actualizar la imagen:", error.message);
        Swal.fire("Error", error.message || "No se pudo actualizar la imagen.", "error");
    }
};

  const handleEditUsuario = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Información",
      html: `
  <div style="text-align: left;">
    <label for="swal-input-name" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">
      Nombre:
    </label>
    <input id="swal-input-name" placeholder="Nombre" value="${usuario.name || ''}" style="
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      margin-bottom: 15px;
    " />

    <label for="swal-input-company" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">
      Compañía:
    </label>
    <input id="swal-input-company" placeholder="Compañía" value="${usuario.company || ''}" style="
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      margin-bottom: 15px;
    " />

    <label for="swal-input-description" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">
      Descripción:
    </label>
    <textarea id="swal-input-description" placeholder="Descripción" style="
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      margin-bottom: 15px;
      resize: none;
      height: 100px;
    ">${usuario.description || ''}</textarea>
  </div>
`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const name = document.getElementById("swal-input-name").value.trim();
        const company = document.getElementById("swal-input-company").value.trim();
        const description = document.getElementById("swal-input-description").value.trim();
  
        if (!name || !company  ) {
          Swal.showValidationMessage("Ambos campos son obligatorios");
          return null;
        }
  
        return { name, company, description };
      },
    });
  
    if (formValues) {
      try {
        const usuarioId = localStorage.getItem("id");
        const updatedUsuario = await updateUsuario(usuarioId, formValues);
  
        if (updatedUsuario) {
          setUsuario(updatedUsuario); 
          Swal.fire("¡Éxito!", "Información actualizada correctamente.", "success");
        } else {
          Swal.fire("Error", "No se pudo actualizar la información.", "error");
        }
      } catch (error) {
        console.error("Error al actualizar la información:", error.message);
        Swal.fire("Error", "No se pudo actualizar la información.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        {/* Título de la página */}
        <h1 className="text-4xl font-bold mb-6 text-center md:text-left">Mi Perfil</h1>
  
        {/* Contenido del perfil */}
        {usuario && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Imagen de perfil */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">Imagen de Perfil</h2>
              <div className="relative flex flex-col items-center mb-4">
                {/* Círculo de imagen */}
                {usuario.imagen ? (
                  <img
                    src={`http://localhost:3333${usuario.imagen}`}
                    alt="Imagen de perfil"
                    className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-full border-2 border-gray-300">
                    <p className="text-gray-500">Sin imagen</p>
                  </div>
                )}
  
                {/* Botón para subir imagen */}
                <label
                  htmlFor="file-upload"
                  className="mt-4 inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 cursor-pointer"
                >
                  Cambiar imagen
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImagen}
                />
              </div>
            </div>
  
            {/* Información del usuario */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/3">
              <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
              <div className="space-y-2">
                <p>
                  <strong className="text-gray-700">Nombre:</strong> {usuario.name}
                </p>
                <p>
                  <strong className="text-gray-700">Email:</strong> {usuario.email}
                </p>
                <p>
                  <strong className="text-gray-700">Compañía:</strong> {usuario.company}
                </p>
                <p>
                  <strong className="text-gray-700">Descripción:</strong> {usuario.description}
                </p>
              </div>
              {/* Botón para editar información */}
              <button
                onClick={handleEditUsuario}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Editar Información
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;



