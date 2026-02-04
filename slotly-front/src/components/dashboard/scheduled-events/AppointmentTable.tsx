import type { Appointment } from "../../../types/Appointment";
import { AppointmentActions } from "./AppointmentActions";

interface AppointmentTableProps {
  data: Appointment[];
  isLoading: boolean;
}

export function AppointmentTable({ data, isLoading }: AppointmentTableProps) {
  const getStatusStyle = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      pending: "bg-orange-100 text-orange-700",
      canceled: "bg-red-100 text-red-700",
      completed: "bg-blue-100 text-blue-700",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Carregando agendamentos...
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[500px] scrollbar-hide">
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 text-sm uppercase tracking-wider">
            <th className="px-8 py-5 font-medium">Data/Horário</th>
            <th className="px-8 py-5 font-medium">Cliente</th>
            <th className="px-8 py-5 font-medium">Serviço</th>
            <th className="px-8 py-5 font-medium">Status</th>
            <th className="px-8 py-5 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-10 text-gray-400 italic"
              >
                Nenhum evento encontrado.
              </td>
            </tr>
          ) : (
            data.map((apt) => (
              <tr
                key={apt.id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-8 py-5 text-gray-600">
                  {formatDateTime(apt.start_time)}
                </td>
                <td className="px-8 py-5 font-bold text-gray-900">
                  {apt.client.name}
                </td>
                <td className="px-8 py-5 text-gray-600">{apt.service.name}</td>
                <td className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(apt.status)}`}
                  >
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <AppointmentActions
                    appointmentId={apt.id}
                    currentStatus={apt.status}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
