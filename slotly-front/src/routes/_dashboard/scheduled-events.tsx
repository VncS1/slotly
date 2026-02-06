import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppointmentTable } from "../../components/dashboard/scheduled-events/AppointmentTable";
import type { AppointmentFilters } from "../../types/Appointment";

export const Route = createFileRoute("/_dashboard/scheduled-events")({
  validateSearch: (search: Record<string, unknown>): AppointmentFilters => {
    return {
      status: (search.status as any) || "upcoming",
      page: Number(search.page) || 1,
      start_date: (search.start_date as string) || undefined,
      end_date: (search.end_date as string) || undefined,
    };
  },
  component: ScheduledEventsPage,
});

const statusLabels = {
  upcoming: "Em breve",
  pending: "Pendentes",
  past: "Histórico",
  "date-range": "Por período",
};

export function ScheduledEventsPage() {
  const { status, page, start_date, end_date } = useSearch({
    from: "/_dashboard/scheduled-events",
  });

  const navigate = useNavigate({
    from: "/scheduled-events",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", status, page, start_date, end_date],
    queryFn: async () => {
      const response = await api.get("/appointments", {
        // Enviamos o per_page fixo em 10 para alinhar com o Laravel
        params: { status, page, start_date, end_date, per_page: 10 },
      });
      return response.data;
    },
    // A query só roda se NÃO for período, ou se o período tiver as duas datas
    enabled: status !== "date-range" || (!!start_date && !!end_date),
  });

  const appointments = data?.data || [];
  const lastPage = data?.meta?.last_page || 1;

  const handleTabChange = (newStatus: string) => {
    // Pegamos a data de hoje formatada em YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    navigate({
      search: (prev) => ({
        ...prev,
        status: newStatus as any,
        page: 1,
        // Se mudar para 'date-range', injetamos hoje por padrão
        // Se mudar para outra tab, limpamos as datas
        start_date: newStatus === "date-range" ? today : undefined,
        end_date: newStatus === "date-range" ? today : undefined,
      }),
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciador de Serviços
          </h1>
          <p className="text-gray-500">
            Gerencie seus agendamentos e acompanhe seu fluxo de trabalho.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs de Status */}
        <div className="flex border-b border-gray-100 px-6">
          {["upcoming", "pending", "past", "date-range"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`py-4 px-4 text-sm font-semibold capitalize transition-all border-b-2 -mb-[2px] ${
                status === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {statusLabels[tab as keyof typeof statusLabels]}
            </button>
          ))}
        </div>

        {/* Filtros de Data (Só aparece na aba específica) */}
        {status === "date-range" && (
          <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-6 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                  Data Início
                </label>
                <input
                  type="date"
                  value={start_date || ""}
                  onChange={(e) =>
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        start_date: e.target.value,
                        page: 1,
                      }),
                    })
                  }
                  className="rounded-lg border-gray-200 text-sm focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={end_date || ""}
                  onChange={(e) =>
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        end_date: e.target.value,
                        page: 1,
                      }),
                    })
                  }
                  className="rounded-lg border-gray-200 text-sm focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <AppointmentTable data={appointments} isLoading={isLoading} />

        {/* Paginação */}
        <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, page: page - 1 }) })
            }
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-1">
            <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm shadow-sm">
              {page}
            </span>
            <span className="text-gray-400 text-xs px-2">de {lastPage}</span>
          </div>

          <button
            disabled={page >= lastPage}
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, page: page + 1 }) })
            }
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
