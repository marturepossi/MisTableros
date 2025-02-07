import { call } from "./api.service";


export const getUsuario = (id) => {
  return call({
    uri: `/usuarios/${id}`, 
    method: "GET",
  });
};
export const updateUsuario = (id, updates) => {
  return call({
      uri: `/usuarios/${id}`,
      method: "PATCH",
      body: updates, // Enviar FormData directamente
  });
};

export const updateUsuarioImagen = (id, formData) => {
  return call({
    uri: `/usuarios/${id}/imagen`,
    method: "PATCH",
    body: formData,
  });
};
