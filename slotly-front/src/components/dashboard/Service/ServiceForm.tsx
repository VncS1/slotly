import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceFormValues } from "./-service_schema";
import { api } from "../../../lib/api";
import { Building, Clock, DollarSign, Group } from "lucide-react";

interface ServiceFormProps {
  onSuccess: () => void;
}

export function ServiceForm({ onSuccess }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      modality: "online",
      is_active: true,
    },
  });

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      await api.post("/services", data);
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar serviço no Laravel:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Nome do Serviço
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-4 w-4 h-4 text-gray-400" />

          <input
            {...register("name")}
            placeholder="Ex: Corte de Cabelo"
            className={`w-full pl-9 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none ${errors.name ? "border-red-500" : ""}`}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-xs mt-1 font-medium">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Duração (minutos)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-4 w-4 h-4 text-gray-400" />

            <input
              type="number"
              {...register("duration_minutes")}
              className="w-full pl-9 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          {errors.duration_minutes && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.duration_minutes.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="number"
              step="0.01"
              {...register("price")}
              className="w-full pl-9 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">
              {errors.price.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Modalidade
          </label>
          <div className="relative">
            <Group className="absolute left-3 top-4 w-4 h-4 text-gray-400" />

            <select
              {...register("modality")}
              className="w-full pl-9 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="online">Online</option>
              <option value="in_person">Presencial</option>
            </select>
          </div>
          {errors.modality && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.modality.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : "Criar Serviço"}
        </button>
      </div>
    </form>
  );
}
