import * as yup from "yup";

export const usuarioSchema = yup.object({
    name: yup
        .string()
        .required("El nombre es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre no puede tener más de 50 caracteres"),
    email: yup
        .string()
        .required("El correo electrónico es obligatorio")
        .email("Debe ser un correo válido"),
    password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
    company: yup
        .string()
        .notRequired() 
        .max(100, "El nombre de la empresa no puede tener más de 100 caracteres"),
    description: yup
        .string()
        .nullable()
        .max(255, "La descripción no puede tener más de 255 caracteres"), 
    
});
