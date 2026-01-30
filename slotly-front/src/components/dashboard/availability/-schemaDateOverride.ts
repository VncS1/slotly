import z from "zod";

export const overrideSchema = z.object({
  title: z.string().min(3, "Título muito curto"),
  date: z.string().min(1, "Data é obrigatória"),
  is_closed: z.boolean(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
}).refine(data => {
  if (!data.is_closed && (!data.start_time || !data.end_time)) return false;
  return true;
}, { message: "Horários são obrigatórios se o dia não estiver fechado", path: ["start_time"] });