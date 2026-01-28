import { Edit2, Share2, Copy, Globe, Users } from "lucide-react";
import type { Service } from "../../../types/ServiceCardTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newStatus: boolean) => {
      return await api.patch(`/services/${service.id}`, {
        is_active: newStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const handleToggle = () => {
    mutation.mutate(!service.is_active);
  };

  return (
    <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>

          <button
            onClick={handleToggle}
            disabled={mutation.isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              service.is_active ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                service.is_active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
          <span>{service.duration_minutes} minutes,</span>
          <span className="capitalize">
            {service.modality === "online" ? (
              <span>Online</span>
            ) : (
              <span>Presencial</span>
            )}
          </span>
          {service.modality === "online" ? (
            <Globe size={14} />
          ) : (
            <Users size={14} />
          )}
          <span>R${service.price}.</span>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-4">
          <button className="flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
            <Edit2 size={16} /> Edit
          </button>
          <button className="flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
            <Copy size={16} /> Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
