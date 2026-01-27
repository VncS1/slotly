import z from "zod";

export const ProfileSchema = z.object({
  photo: z
    .instanceof(FileList) // Dizemos: "Espere um objeto do tipo FileList"
    .refine((files) => {
      if (files?.length > 0 && files[0]?.size > 2 * 1024 * 1024) {
        return false;
      }

      return true;
    }, "A imagem deve ter no máximo 2MB.")
    .optional(), // Porque a foto não é obrigatória
  bio: z
    .string()
    .max(1000, "Texto pode ter no máximo 1000 caracteres.")
    .nullable(),
});

export type ProfileFormValues = z.infer<typeof ProfileSchema>;
