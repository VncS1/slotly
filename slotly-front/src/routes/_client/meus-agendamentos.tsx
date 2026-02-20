import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { api } from "../../lib/api";

export const Route = createFileRoute("/_client/meus-agendamentos")({
  component: MyAppointments,
});

function MyAppointments() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );
  const queryClient = useQueryClient();

  const {
    data: appointments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-appointments", activeTab],
    queryFn: async () => {
      const response = await api.get("/client/appointments", {
        params: { status: activeTab },
      });
      return response.data;
    },
  });

  const { mutate: cancelAppointment } = useMutation({
    mutationFn: async (id: number) => {
      return await api.patch(`/appointments/${id}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Erro ao cancelar agendamento.");
    },
  });

  const handleCancel = (id: number) => {
    if (window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      cancelAppointment(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-[#F8FAFC]">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
          Meus Agendamentos
        </h1>
        <p className="text-gray-500 font-medium">
          Gerencie seus horários marcados e histórico de serviços.
        </p>
      </header>

      {/* TABS (Inspirado na sua referência de UI) */}
      <div className="flex gap-10 border-b border-gray-200 mb-10">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === "upcoming"
              ? "text-[#20C997]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Próximos
          {activeTab === "upcoming" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#20C997] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === "history"
              ? "text-[#20C997]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Histórico
          {activeTab === "history" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#20C997] rounded-full" />
          )}
        </button>
      </div>

      {/* LISTA DE AGENDAMENTOS */}
      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center py-20 text-gray-400 gap-4">
            <div className="w-8 h-8 border-4 border-[#20C997] border-t-transparent rounded-full animate-spin" />
            <p className="font-bold">Carregando seus compromissos...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-500 rounded-3xl p-12 flex flex-col items-center text-center">
            <h3 className="text-lg font-bold mb-1">Ops, algo deu errado!</h3>
            <p className="text-sm max-w-xs">
              Não foi possível carregar o histórico. Tente recarregar a página.
            </p>
          </div>
        ) : appointments?.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Nada por aqui ainda
            </h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Você não possui agendamentos nesta categoria no momento.
            </p>
          </div>
        ) : (
          appointments.map((app: any) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      app.status === "active"
                        ? "bg-[#20C997]/10 text-[#20C997]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {app.status === "active" ? "Confirmado" : app.status}
                  </span>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-1">
                  {app.service.name}
                </h3>
                <p className="text-gray-500 text-sm font-bold mb-4">
                  com {app.service.provider.name}
                </p>

                <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-600">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Calendar size={16} className="text-[#20C997]" />
                    {format(parseISO(app.start_time), "dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Clock size={16} className="text-[#20C997]" />
                    {format(parseISO(app.start_time), "HH:mm'h'")}
                  </div>
                </div>
              </div>

              {activeTab === "upcoming" && app.status === "active" && (
                <button
                  onClick={() => handleCancel(app.id)}
                  className="w-full md:w-auto px-6 py-3 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group"
                >
                  <Trash2 size={18} className="group-hover:shake" />
                  Cancelar Agendamento
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
