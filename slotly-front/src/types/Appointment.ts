export type AppointmentStatus = 'active' | 'pending' | 'canceled' | 'completed';

export interface Appointment {
  id: number;
  start_time: string;
  status: AppointmentStatus;
  client: { name: string };
  service: { name: string };
}

export interface AppointmentFilters {
  status: 'upcoming' | 'pending' | 'past' | 'date-range';
  page: number;
  start_date?: string; 
  end_date?: string;   
}