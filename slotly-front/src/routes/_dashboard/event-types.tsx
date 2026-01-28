import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../lib/api";
import { EventCardSkeleton } from "../../components/EventCardSkeleton";
import { EventTypesEmptyState } from "../../components/dashboard/Service/EmptyState";
import { ServiceCard } from "../../components/dashboard/Service/ServiceCard";
import { ServiceForm } from "../../components/dashboard/Service/ServiceForm";
import { EventTypesHeader } from "../../components/dashboard/Service/EventTypesHeader";
import { useState } from "react";

export const Route = createFileRoute("/_dashboard/event-types")({
  component: EventTypes,
});

export function EventTypes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: services,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get("/services");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-medium">
          Ocorreu um erro ao carregar os dados.
        </p>
      </div>
    );
  }

  if (!services || services?.length === 0) {
    return <EventTypesEmptyState />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <EventTypesHeader onOpenModal={() => setIsModalOpen(true)} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      ) : !services || services.length === 0 ? (
        <EventTypesEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Novo Serviço</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>

            <div className="p-6">
              <ServiceForm
                onSuccess={() => {
                  setIsModalOpen(false);
                  queryClient.invalidateQueries({ queryKey: ["services"] });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
