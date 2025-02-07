import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { getTableroById, addMemberToTablero } from "../services/tableros.service";

import {createTarjeta,updateTarjeta,deleteTarjeta,} from "../services/tarjetas.service";
import {createLista,updateLista,deleteLista,} from "../services/listas.service";

const TableroDetalle = () => {
  const { id: tableroId } = useParams();
  const [tablero, setTablero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [error, setError] = useState(false); 


  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchTableroDetalle = async () => {
      try {
        setLoading(true); 
        setError(false); 
        const response = await getTableroById(tableroId);
        setTablero(response);
      } catch (error) {
        console.error("Error al obtener el tablero:", error.message);
        Swal.fire("Error", "Error al cargar el tablero.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTableroDetalle();
  }, [tableroId]);

  const isMember = tablero?.miembros?.some((miembro) => miembro._id === userId);

  const handleAddMember = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Agregar Miembro",
      html: `
        <div style="text-align: left;">
          <label for="swal-email" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Correo Electrónico del Miembro</label>
          <input id="swal-email" type="email" placeholder="Ingresa el correo electrónico del miembro" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 15px;
          " />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const email = document.getElementById("swal-email").value;
        if (!email) {
          Swal.showValidationMessage("El correo electrónico es obligatorio");
          return null;
        }
        return { email };
      },
    });
  
    if (formValues) {
      try {
        const { email } = formValues;
        const response = await addMemberToTablero(tableroId, email);
        Swal.fire("Éxito", "Miembro agregado exitosamente.", "success");
  
        // recarga con nuevo miembro
        const updatedTablero = await getTableroById(tableroId);
        setTablero(updatedTablero);
      } catch (error) {
        console.error("Error al agregar miembro:", error.message);
  
        Swal.fire(
          "Error",
          error.message || "No se pudo agregar el miembro.",
          "error"
        );
      }
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando tablero...</p>
      </div>
    );
  }
  
  const handleCreateLista = async () => {
    const { value: newTitle } = await Swal.fire({
      title: "Nueva Lista",
      html: `
        <div style="text-align: left;">
          <label for="swal-input1" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Nombre de la Lista</label>
          <input id="swal-input1" placeholder="Ingresa el nombre de la lista" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 15px;
          " />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const title = document.getElementById("swal-input1").value;
        if (!title) {
          Swal.showValidationMessage("El nombre de la lista es obligatorio");
          return null;
        }
        return title;
      },
    });
  
    if (newTitle) {
      try {
        const nuevaLista = await createLista(tableroId, { title: newTitle });
        setTablero((prev) => ({
          ...prev,
          listas: [...prev.listas, { ...nuevaLista, tarjetas: [] }],
        }));
  
        Swal.fire("Éxito", "Lista creada con éxito.", "success");
  
        return nuevaLista;
      } catch (error) {
        console.error("Error al crear la lista:", error.message);
        Swal.fire("Error", "No se pudo crear la lista.", "error");
      }
    }
  };

  const handleEditLista = async (lista) => {
    const { value: newTitle } = await Swal.fire({
      title: "Editar Lista",
      input: "text",
      inputLabel: "Nuevo nombre de la lista",
      inputValue: lista.title,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });
  
    if (newTitle) {
      try {
        const updatedLista = await updateLista(tableroId, lista._id, { title: newTitle });
  
        setTablero((prev) => {
          const updatedLists = prev.listas.map((l) =>
            l._id === lista._id
              ? { ...updatedLista, tarjetas: l.tarjetas } 
              : l
          );
          return { ...prev, listas: updatedLists };
        });
  
        Swal.fire("Éxito", "Lista actualizada con éxito.", "success");
      } catch (error) {
        console.error("Error al actualizar la lista:", error.message);
        Swal.fire("Error", "No se pudo actualizar la lista.", "error");
      }
    }
  };

  const handleDeleteLista = async (listaId) => {
    const result = await Swal.fire({
      title: "¿Eliminar Lista?",
      text: "Esta acción eliminará también todas las tarjetas asociadas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteLista(tableroId, listaId);
        setTablero((prev) => ({
          ...prev,
          listas: prev.listas.filter((lista) => lista._id !== listaId),
        }));
        Swal.fire("Eliminada", "La lista ha sido eliminada con éxito.", "success");
      } catch (error) {
        console.error("Error al eliminar la lista:", error.message);
        Swal.fire("Error", "No se pudo eliminar la lista.", "error");
      }
    }
  };
  const handleViewTarjeta = async (tarjeta) => {
    await Swal.fire({
      title: tarjeta.title,
      html: `
        <div style="text-align: left;">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Título</div>
          <div style="
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            font-size: 21px;
            margin-bottom: 15px;
            background-color: #f9f9f9;
          ">${tarjeta.title}</div>
  
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Descripción</div>
          <div style="
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            font-size: 18px;
            margin-bottom: 15px;
            background-color: #f9f9f9;
          ">${tarjeta.description || "Sin descripción"}</div>
  
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Prioridad</div>
          <div style="
            width: 100%;
            padding: 8px;;
            border-radius: 4px;
            font-size: 18px;
            margin-bottom: 15px;
            background-color: #f9f9f9;
          ">${tarjeta.priority}</div>
  
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Fecha de Vencimiento</div>
          <div style="
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            font-size: 18px;
            margin-bottom: 15px;
            background-color: #f9f9f9;
          ">${tarjeta.dueDate ? new Date(tarjeta.dueDate).toLocaleDateString() : "Sin fecha"}</div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Editar",
      confirmButtonText: "Cerrar",
    }).then((result) => {
      if (result.isDismissed) {
        handleEditTarjeta(tarjeta); 
      }
    });
  };
  const handleCreateTarjeta = async (listaId) => {
    const { value: formValues } = await Swal.fire({
      title: "Nueva Tarjeta",
      html: `
        <div style="text-align: left;">
          <label for="swal-title" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Título</label>
          <input id="swal-title" placeholder="Escribe el título" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 15px;
          " />
          
          <label for="swal-description" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Descripción</label>
          <textarea id="swal-description" placeholder="Escribe una descripción" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 15px;
          "></textarea>
          
          <label for="swal-priority" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Prioridad</label>
          <select id="swal-priority" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 15px;
            background-color: #fff;
          ">
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
          
          <label for="swal-dueDate" style="display: block; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Fecha de Vencimiento</label>
          <input id="swal-dueDate" type="date" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 15px;
          " />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const title = document.getElementById("swal-title").value;
        const description = document.getElementById("swal-description").value;
        const priority = document.getElementById("swal-priority").value;
        const dueDate = document.getElementById("swal-dueDate").value;
  
        if (!title) {
          Swal.showValidationMessage("El título es obligatorio");
          return null;
        }
  
        return { title, description, priority, dueDate };
      },
    });
  
    if (formValues) {
      try {
        const { title, description, priority, dueDate } = formValues;
        const nuevaTarjeta = await createTarjeta(listaId, {
          title,
          description,
          priority,
          dueDate,
        });
  
        setTablero((prev) => {
          const updatedLists = prev.listas.map((lista) => {
            if (lista._id === listaId) {
              return { ...lista, tarjetas: [...lista.tarjetas, nuevaTarjeta] };
            }
            return lista;
          });
          return { ...prev, listas: updatedLists };
        });
  
        Swal.fire("Éxito", "Tarjeta creada con éxito.", "success");
      } catch (error) {
        console.error("Error al crear tarjeta:", error.message);
        Swal.fire("Error", "No se pudo crear la tarjeta.", "error");
      }
    }
  };

  const handleEditTarjeta = async (tarjeta) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Tarjeta",
      html: `
        <div style="text-align: left;">
           <label for="swal-input1" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Título</label>
          <input id="swal-title" value="${tarjeta.title}" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 15px;
          " />
           <label for="swal-input1" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Descripción</label>
          <textarea id="swal-description" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 15px;
          ">${tarjeta.description || ""}</textarea>
           <label for="swal-input1" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Prioridad</label>
          <select id="swal-priority" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            background-color: #fff;
            margin-bottom: 15px;
          ">
            <option value="Alta" ${
              tarjeta.priority === "Alta" ? "selected" : ""
            }>Alta</option>
            <option value="Media" ${
              tarjeta.priority === "Media" ? "selected" : ""
            }>Media</option>
            <option value="Baja" ${
              tarjeta.priority === "Baja" ? "selected" : ""
            }>Baja</option>
          </select>
           <label for="swal-input1" style="display: block; font-size: 18px; font-weight: bold; margin-bottom: 5px;">Fecha de Vencimiento</label>
          <input id="swal-dueDate" type="date" value="${
            tarjeta.dueDate
              ? new Date(tarjeta.dueDate).toISOString().split("T")[0]
              : ""
          }" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 15px;
          " />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const title = document.getElementById("swal-title").value;
        const description = document.getElementById("swal-description").value;
        const priority = document.getElementById("swal-priority").value;
        const dueDate = document.getElementById("swal-dueDate").value;

        if (!title) {
          Swal.showValidationMessage("El título es obligatorio");
          return null;
        }

        return { title, description, priority, dueDate };
      },
    });

    if (formValues) {
      try {
        const updatedTarjeta = await updateTarjeta(tarjeta._id, formValues);

        setTablero((prev) => {
          const updatedLists = prev.listas.map((lista) => {
            if (lista.tarjetas.some((t) => t._id === tarjeta._id)) {
              return {
                ...lista,
                tarjetas: lista.tarjetas.map((t) =>
                  t._id === tarjeta._id ? updatedTarjeta : t
                ),
              };
            }
            return lista;
          });
          return { ...prev, listas: updatedLists };
        });

        Swal.fire("Éxito", "Tarjeta actualizada con éxito.", "success");
      } catch (error) {
        console.error("Error al actualizar la tarjeta:", error.message);
        Swal.fire("Error", "No se pudo actualizar la tarjeta.", "error");
      }
    }
  };


  const handleDeleteTarjeta = async (tarjetaId, listaId) => {
    const result = await Swal.fire({
      title: "¿Eliminar Tarjeta?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteTarjeta(tarjetaId);
        setTablero((prev) => {
          const updatedLists = prev.listas.map((lista) => {
            if (lista._id === listaId) {
              return {
                ...lista,
                tarjetas: lista.tarjetas.filter((tarjeta) => tarjeta._id !== tarjetaId),
              };
            }
            return lista;
          });
          return { ...prev, listas: updatedLists };
        });
        Swal.fire("Eliminada", "La tarjeta ha sido eliminada con éxito.", "success");
      } catch (error) {
        console.error("Error al eliminar la tarjeta:", error.message);
        Swal.fire("Error", "No se pudo eliminar la tarjeta.", "error");
      }
    }
  };

  const toggleMenu = (listaId) => {
    setOpenMenu((prev) => (prev === listaId ? null : listaId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando tablero...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-left p-4">
      <div className="container mx-auto flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-center mb-4">{tablero?.name || "Tablero"}</h1>
        {/* Dropdown de miembros */}
        <div className="relative">
  <button
    onClick={() => setOpenMenu(openMenu === "miembros" ? null : "miembros")}
    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
  >
    Miembros
  </button>
  {openMenu === "miembros" && (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-10">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 truncate">Miembros</h2>
        <ul className="list-disc  mb-4 space-y-1">
          {tablero.miembros.map((miembro) => (
            <li
              key={miembro._id}
              className="text-gray-700 truncate w-full"
              style={{ wordBreak: "break-word" }}
            >
              <p><strong>{miembro.email}</strong></p>
            </li>
          ))}
        </ul>
        {isMember && (
          <button
            onClick={() => {
              handleAddMember();
              setOpenMenu(null); // se cierra el menu
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
          >
            + Agregar Miembro
          </button>
        )}
      </div>
    </div>
  )}
</div>
      </div>
  
      {/* Listas del tablero */}
      {tablero?.listas?.length > 0 ? (
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tablero.listas.map((lista) => (
            <div
              key={lista._id}
              className="bg-gray-100 p-4 rounded-md shadow-md relative"
              style={{ minHeight: "auto" }} 
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{lista.title}</h2>
                <button
                  onClick={() => toggleMenu(lista._id)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ⋮
                </button>
              </div>
              {openMenu === lista._id && (
                <div
                  className="absolute top-8 right-2 bg-white shadow-lg rounded z-10"
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    onClick={() => handleEditLista(lista)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteLista(lista._id)}
                    className="block px-4 py-2 text-sm text-red-700 hover:bg-red-200"
                  >
                    Eliminar
                  </button>
                </div>
              )}
         <div className="mt-4">
  {lista.tarjetas?.map((tarjeta) => (
    <div
      key={tarjeta._id}
      className="bg-white p-2 rounded-md shadow-sm mb-2 relative cursor-pointer"
      onClick={() => handleViewTarjeta(tarjeta)} 
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{tarjeta.title}</h3>
          <span className="text-xs text-gray-400">
            Prioridad: {tarjeta.priority}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            setOpenMenu(openMenu === tarjeta._id ? null : tarjeta._id);
          }}
          className="absolute top-2 right-2 cursor-pointer text-gray-600 bg-gray-200 flex items-center justify-center w-8 h-8 rounded hover:bg-gray-300"
        >
          ⋮
        </button>
      </div>
      {openMenu === tarjeta._id && (
        <div
          className="absolute top-8 right-2 bg-white shadow-lg rounded z-10"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              handleEditTarjeta(tarjeta);
              setOpenMenu(null);
            }}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              handleDeleteTarjeta(tarjeta._id, lista._id);
              setOpenMenu(null);
            }}
            className="block px-4 py-2 text-sm text-red-700 hover:bg-red-200"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  ))}
</div>
              {isMember && (
                <div
                  onClick={() => handleCreateTarjeta(lista._id)}
                  className="bg-gray-200 p-2 rounded-md shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
                >
                  <div className="text-center">
                    <p className="text-gray-600 ">+ Añadir Tarjeta</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* Tarjeta para añadir una nueva lista */}
          {isMember && (
            <div
              onClick={handleCreateLista}
              className= "bg-gray-200 p-4 rounded-md shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
            >
              <div className="text-center">
                <span className="text-3xl font-semibold text-gray-400 ">+</span>
                <p className="text-gray-600 mt-2">Añadir Lista</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No hay listas asociadas.</p>
      )}
    </div>
  );
};

export default TableroDetalle;
