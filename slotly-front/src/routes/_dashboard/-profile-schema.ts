import z from "zod";

export const SettingsSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Informe um telefone válido"),
  current_password: z.string().optional(),
  new_password: z
    .string()
    .min(6, "A nova senha deve ter 6+ caracteres")
    .optional()
    .or(z.literal("")),
});

export type SettingsFormValues = z.infer<typeof SettingsSchema>;