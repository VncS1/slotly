import { z } from "zod";

export const SettingsSchema = z.object({
  name: z.string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .nonempty({ message: "O nome é obrigatório." }),
    
  email: z.string()
    .email({ message: "Insira um endereço de e-mail válido." }),
    
  // O telefone é opcional, mas se for preenchido, precisa ser válido
  phone: z.string()
    .min(10, { message: "Insira um telefone válido com DDD." })
    .optional()
    .or(z.literal("")),
    
  current_password: z.string().optional(),
  
  new_password: z.string()
    .min(8, { message: "A nova senha deve ter no mínimo 8 caracteres." })
    .optional()
    .or(z.literal("")),
    
}).refine(
  (data) => {
    // REGRA DE NEGÓCIO: Se preencheu a nova senha, TEM que preencher a atual
    if (data.new_password && !data.current_password) {
      return false;
    }
    return true;
  },
  {
    message: "A senha atual é obrigatória para definir uma nova.",
    path: ["current_password"], // O erro vai aparecer debaixo do input de senha atual
  }
);

// Exportamos a tipagem TypeScript inferida diretamente do Zod
export type SettingsFormValues = z.infer<typeof SettingsSchema>;