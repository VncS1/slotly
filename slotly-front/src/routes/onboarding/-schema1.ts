import z from "zod";

export const SlugSchema = z.object({
  business_slug: z
    .string()
    .min(3, "A URL deve ter pelo menos 3 letras.")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens."),
});

export type SlugFormValues = z.infer<typeof SlugSchema>;