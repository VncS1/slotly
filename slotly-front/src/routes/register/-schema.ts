import { z } from "zod";

const BaseSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  password_confirmation: z.string(),
});

export const ClientRegisterSchema = BaseSchema.refine(
  (data) => data.password === data.password_confirmation,
  {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  },
);

export const ProviderRegisterSchema = BaseSchema.extend({
  business_name: z.string().min(3, "O nome do negócio é obrigatório."),
}).refine((data) => data.password === data.password_confirmation, {
  message: "As senhas não coincidem",
  path: ["password_confirmation"],
});

export type ClientRegisterFormValues = z.infer<typeof ClientRegisterSchema>;
export type ProviderRegisterFormValues = z.infer<typeof ProviderRegisterSchema>;
