export interface Service {
  id: number;
  name: string;
  duration_minutes: number;
  modality: "online" | "in_person";
  price: number;
  is_active: boolean;
}