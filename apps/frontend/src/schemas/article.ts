import { z } from "zod";

export const articleInputSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(200, "El título es demasiado largo"),
  content: z.string().trim().min(1, "El contenido es obligatorio"),
  coverImageUrl: z
    .union([z.string().trim().url("La URL de la imagen no es válida"), z.literal("")])
    .optional(),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
