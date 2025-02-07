import { call } from './api.service';

export const getTableros = () => {
  return call({ uri: '/tableros', method: 'GET' });
};

export const getAllTableros = () => {
  return call({
    uri: "/tableros/todos",
    method: "GET",
  });
};

export const createTablero = (tablero) => {
  return call({
    uri: '/tableros',
    method: 'POST',
    body: tablero,
  });
};

export const updateTablero = (id, tablero) => {
  return call({
      uri: `/tableros/${id}`,
      method: "PATCH",
      body: tablero, 
  });
};


export const deleteTablero = (id) => {
  return call({
    uri: `/tableros/${id}`,
    method: 'DELETE',
  });
};
export const getTableroById = (id) => {
  return call({ 
    uri: `/tableros/${id}`,
    method: "GET" });
};

export const addMemberToTablero = (id, email) => {
  return call({
    uri: `/tableros/${id}/miembros/email`,
    method: "POST",
    body: { email },
  });
};