import * as yup from "yup";


export const tarjetaSchema = yup.object({
  title: yup
    .string()
    .required("El título de la tarjeta es obligatorio")
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(50, "El título no puede tener más de 50 caracteres"),
  description: yup
    .string()
    .max(200, "La descripción no puede superar los 200 caracteres")
    .optional(),
  priority: yup
    .string()
    .oneOf(["Alta", "Media", "Baja"], "Prioridad inválida")
    .default("Media"),
  dueDate: yup.date().optional(),
  listId: yup.string().optional(),
});




