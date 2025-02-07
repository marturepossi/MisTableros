import * as yup from "yup";

export const tableroSchema = yup.object({
    name: yup
        .string()
        .required("El nombre del tablero es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre no puede tener más de 50 caracteres"),
    status: yup
        .string()
        .oneOf(["En curso", "Cancelado", "Terminado"], "Estado inválido")
        .default("En curso"),
    category: yup
        .string()
        .required("La categoría es obligatoria")
        .oneOf(
            ["General", "Marketing", "Diseño", "Negocios", "Educación"],
            "Categoría no válida"
        ),
    miembros: yup
        .array()
        .of(yup.string().required("Cada miembro debe ser un ID válido"))
        .default([]), // Lista vacía por defecto
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date()),
});
