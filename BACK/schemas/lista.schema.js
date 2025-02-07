import * as yup from "yup";

export const listaSchema = yup.object({
    title: yup
        .string()
        .required("El título de la lista es obligatorio")
        .min(3, "El título debe tener al menos 3 caracteres")
        .max(50, "El título no puede tener más de 50 caracteres"),
});
