import { call } from "./api.service";

export const createLista = async (tableroId, listaData) => {
    return call({
      uri: `/tableros/${tableroId}/listas`,
      method: "POST",
      body: listaData,
    });
  };

export const updateLista = (tableroId, listaId, updates) => {
    return call({
      uri: `/tableros/${tableroId}/listas/${listaId}`,
      method: "PATCH",
      body: updates,
    });
  };
  

  export const deleteLista = (tableroId, listaId) => {
    return call({
      uri: `/tableros/${tableroId}/listas/${listaId}`,
      method: "DELETE",
    });
  };
  
  