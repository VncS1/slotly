import z from "zod";

export const serviceSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  duration_minutes: z.coerce.number().min(5, "Mínimo 5 minutos"),
  price: z.coerce.number().min(0, "Preço inválido"),
  modality: z.enum(["online", "in_person"]), // <--- O campo novo!
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;