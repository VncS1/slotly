export interface DateOverride {
  id?: number;
  user_id?: number;
  title: string;
  date: string; // Usamos apenas 'date' para bater com o Controller
  is_closed: boolean;
  start_time: string | null;
  end_time: string | null;
  created_at?: string;
  updated_at?: string;
}