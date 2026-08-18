import { z } from "zod";

export const articleInputSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(200, "El título es demasiado largo"),
  content: z.string().trim().min(1, "El contenido es obligatorio"),
  coverImageUrl: z
    .union([z.string().trim().url("La URL de la imagen no es válida"), z.literal("")])
    .optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const searchSchema = z.object({
  q: z.string().trim().min(1, "Ingresá un término de búsqueda"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
