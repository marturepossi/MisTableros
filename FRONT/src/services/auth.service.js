import { call } from "./api.service";

export async function login(email, password) {
  return call({
    uri: "/usuario/login", 
    method: "POST",
    body: { email, password }, 
  });
}


export async function registro(name, email, password, company, image, description) {
  return call({
    uri: "usuarios", 
    method: "POST",
    body: { name, email, password, company, image, description }, 
  });
}
