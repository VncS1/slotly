import type { Appointment } from "../../../types/Appointment";
import { AppointmentActions } from "./AppointmentActions";

interface AppointmentTableProps {
  data: Appointment[];
  isLoading: boolean;
}

const statusTranslations: Record<string, string> = {
  active: "Ativo",
  pending: "Pendente",
  canceled: "Cancelado",
  completed: "Concluído",
};

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
    <div className="overflow-x-auto">
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 text-sm uppercase tracking-wider">
            <th className="px-8 py-5 font-medium w-48">Data/Horário</th>
            <th className="px-8 py-5 font-medium">Cliente</th>
            <th className="px-8 py-5 font-medium w-64">Serviço</th>
            <th className="px-8 py-5 font-medium w-32">Status</th>
            <th className="px-8 py-5 font-medium text-right w-0">Ações</th>
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
            data.map((apt) => {
              const isCanceled = apt.status === "canceled";
              const isCompleted = apt.status === "completed";

              return (
                <tr
                  key={apt.id}
                  className={`
                    transition-colors group
                    ${isCanceled && "opacity-50 bg-gray-50/30"} 
                    ${isCompleted && "bg-blue-50/10"} 
                    ${!isCanceled && !isCompleted && "hover:bg-gray-50/50"}
                  `}
                >
                  <td
                    className={`px-8 py-5 whitespace-nowrap text-sm ${isCompleted ? "text-blue-700/70" : "text-gray-600"}`}
                  >
                    {formatDateTime(apt.start_time)}
                  </td>

                  <td
                    className={`
                    px-8 py-5 font-bold text-sm
                    ${isCanceled ? "text-gray-400 line-through" : "text-gray-900"}
                    ${isCompleted ? "text-blue-900/80" : ""}
                  `}
                  >
                    {apt.client?.name || "Cliente não encontrado"}
                  </td>

                  <td
                    className={`px-8 py-5 text-sm ${isCanceled ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {apt.service?.name || "Serviço não encontrado"}
                  </td>

                  <td className="px-8 py-5 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(apt.status)}`}
                    >
                      {statusTranslations[apt.status] || apt.status}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <AppointmentActions
                      appointmentId={apt.id}
                      currentStatus={apt.status}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
