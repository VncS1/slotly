import { z } from "zod";

// Mantemos o 'as const' para garantir a imutabilidade
const serviceModalities = ["online", "in_person"] as const;

export const serviceSchema = z.object({
  name: z.string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(50, "Nome muito longo"),
    
  duration_minutes: z.coerce.number()
    .min(5, "A duração mínima é de 5 minutos")
    .max(480, "Duração máxima de 8 horas"),

  modality: z.enum(serviceModalities, {
    // Para enums, o Zod espera a chave 'message' para o erro de validação
    message: "Selecione 'Online' ou 'Presencial'",
  }),
  price: z.coerce.number()
  .min(1),
  is_active: z.boolean().default(true),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;