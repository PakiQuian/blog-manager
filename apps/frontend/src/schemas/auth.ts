import { z } from "zod";

export const emailSchema = z.string().trim().min(1, "El email es obligatorio").email("Email inválido");
export const passwordSchema = z.string().min(8, "La contraseña debe tener al menos 8 caracteres");
export const nameSchema = z.string().trim().min(1, "El nombre es obligatorio").max(100, "Nombre demasiado largo");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});
