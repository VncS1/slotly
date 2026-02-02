import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { isValidTimeRange } from "../../utils/timeValidation";
import type {
  DateOverride,
  ScheduleConfig,
  ScheduleConfigRequest,
} from "../../types/ScheduleConfigTypes";

import { DAYS_OF_WEEK } from "../../types/ScheduleConfigTypes";
import { DayScheduleRow } from "../../components/dashboard/availability/DayScheduleRow";
import { DateOverrideForm } from "../../components/dashboard/availability/DateOverrideForm";
import { DateOverrideItem } from "../../components/dashboard/availability/DateOverrideItem";

export const Route = createFileRoute("/_dashboard/availability")({
  component: AvailabilityPage,
});

export function AvailabilityPage() {
  const queryClient = useQueryClient();

  const [schedules, setSchedules] = useState<ScheduleConfig[]>([]);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

  const { data: initialData, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["schedule-configs"],
    queryFn: async () => (await api.get("/schedule-configs")).data,
  });

  const { data: overrides, isLoading: isLoadingOverrides } = useQuery({
    queryKey: ["date-overrides"],
    queryFn: async () => (await api.get("/date-overrides")).data,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: ScheduleConfigRequest) => {
      return await api.post("/schedule-configs", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-configs"] });
      alert("Agenda atualizada com sucesso!");
    },
  });

  const addOverrideMutation = useMutation({
    mutationFn: (newOverride: any) => api.post("/date-overrides", newOverride),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["date-overrides"] });
      setIsOverrideModalOpen(false);
    },
  });

  const deleteOverrideMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/date-overrides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["date-overrides"] });
    },
    onError: (error) => {
      console.error("Erro ao remover a exceção:", error);
      alert("Não foi possível remover a exceção.");
    },
  });

  useEffect(() => {
    if (initialData) setSchedules(initialData);
  }, [initialData]);

  const handleUpdateDay = (newConfig: ScheduleConfig) => {
    setSchedules((prev) => {
      const filtered = prev.filter(
        (s) => s.day_of_week !== newConfig.day_of_week,
      );
      return [...filtered, newConfig].sort(
        (a, b) => a.day_of_week - b.day_of_week,
      );
    });
  };

  const handleDeleteDay = (index: number) => {
    setSchedules((prev) => prev.filter((s) => s.day_of_week !== index));
  };

  const handleSave = () => {
    if (schedules.some((s) => !isValidTimeRange(s.start_time, s.end_time))) {
      alert("Por favor, corrija os horários inválidos antes de salvar.");
      return;
    }
    saveMutation.mutate({ schedules });
  };

  const handleDeleteOverride = (id: number, title: string) => {
    if (
      window.confirm(`Tem certeza que deseja remover a exceção "${title}"?`)
    ) {
      deleteOverrideMutation.mutate(id);
    }
  };

  if (isLoadingSchedules || isLoadingOverrides) {
    return (
      <div className="p-10 text-center text-gray-500">Carregando dados...</div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Minha Disponibilidade
          </h1>
          <p className="text-gray-500">
            Configure seus horários de trabalho e exceções.
          </p>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wider">
          Horários Semanais
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {DAYS_OF_WEEK.map((dayName, index) => (
            <DayScheduleRow
              key={dayName}
              dayName={dayName}
              dayIndex={index}
              config={schedules.find((s) => s.day_of_week === index)}
              onChange={handleUpdateDay}
              onDelete={() => handleDeleteDay(index)}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {saveMutation.isPending ? "Salvando..." : "Salvar Agenda"}
          </button>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-wider">
            Exceções e Folgas
          </h2>
          <button
            onClick={() => setIsOverrideModalOpen(true)}
            className="text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-all border border-blue-100"
          >
            + Add Override
          </button>
        </div>

        <div className="space-y-3">
          {overrides?.length === 0 && (
            <p className="text-gray-400 text-sm italic">
              Nenhuma exceção configurada.
            </p>
          )}
          {overrides?.map((override: DateOverride) => (
            <DateOverrideItem
              key={override.id}
              override={override}
              onDelete={() =>
                handleDeleteOverride(override.id!, override.title)
              }
            />
          ))}
        </div>
      </section>

      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Nova Exceção</h2>
              <button
                onClick={() => setIsOverrideModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                Fechar
              </button>
            </div>
            <div className="p-6">
              <DateOverrideForm
                onSubmit={(data) => addOverrideMutation.mutate(data)}
                onCancel={() => setIsOverrideModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
