import { call } from "./api.service";

export const createTarjeta = (listaId, tarjeta) => {
    return call({
      uri: `/listas/${listaId}/tarjetas`,
      method: "POST",
      body: tarjeta,
    });
  };

  export const updateTarjeta = (tarjetaId, tarjeta) => {
    return call({
      uri: `/tarjetas/${tarjetaId}`,
      method: "PATCH",
      body: tarjeta,
    });
  };

export const deleteTarjeta = (id) => {
    return call({
      uri: `/tarjetas/${id}`,
      method: 'DELETE',
    });
  };
  
  