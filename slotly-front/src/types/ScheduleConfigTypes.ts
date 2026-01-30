export interface ScheduleConfig {
  id?: number;
  user_id?: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  lunch_start_time: string | null;
  lunch_end_time: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleConfigRequest {
  schedules: ScheduleConfig[];
}

export const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

export interface DateOverride {
  id?: number;
  title: string;
  date: string; // Formato "YYYY-MM-DD" para o input date do HTML
  is_closed: boolean;
  start_time: string | null;
  end_time: string | null;
}