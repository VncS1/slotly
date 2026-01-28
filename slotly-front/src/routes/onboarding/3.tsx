import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../lib/api";
import { Plus, Clock, DollarSign } from "lucide-react";
import { AxiosError } from "axios";
import { useState } from "react";
import { serviceSchema, type ServiceFormValues } from "./-schema3";

export const Route = createFileRoute("/onboarding/3")({
  beforeLoad: () => {
    if (!localStorage.getItem("slotly_token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: OnboardingStep3,
});

function OnboardingStep3() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      modality: "online",
      duration_minutes: 30,
      price: 0,
    },
  });

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      setServerError(null);

      await api.post("/services", data);

      await navigate({ to: "/event-types" });
    } catch (error) {
      if (error instanceof AxiosError) {
        setServerError(
          error.response?.data?.message || "Erro ao criar serviço.",
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-xl mb-8">
        <p className="text-sm font-medium text-gray-900 mb-2">Step 3 of 3</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-blue-600 h-2 rounded-full w-full transition-all duration-500"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-medium">
          <span className="text-blue-600">URL</span>
          <span className="text-blue-600">Profile</span>
          <span className="text-blue-600">First Service</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Defina seu primeiro serviço
          </h1>
          <p className="text-gray-500 mt-1">
            O que as pessoas vão agendar com você? Você poderá criar outros
            tipos (Event Types) depois no painel.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Evento
            </label>
            <input
              {...register("name")}
              placeholder="Ex: Consultoria de 30min"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração (min)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  {...register("duration_minutes")}
                  className="w-full pl-9 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              {errors.duration_minutes && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.duration_minutes.message as string}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Onde vai acontecer?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="online"
                  {...register("modality")}
                  className="peer hidden"
                />
                <div className="border border-gray-200 rounded-xl p-4 text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all hover:bg-gray-50">
                  <div className="text-2xl mb-1">💻</div>
                  <span className="font-medium text-sm text-gray-700 peer-checked:text-blue-700">
                    Online
                  </span>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="in_person"
                  {...register("modality")}
                  className="peer hidden"
                />
                <div className="border border-gray-200 rounded-xl p-4 text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all hover:bg-gray-50">
                  <div className="text-2xl mb-1">📍</div>
                  <span className="font-medium text-sm text-gray-700 peer-checked:text-blue-700">
                    Presencial
                  </span>
                </div>
              </label>
            </div>
            {errors.modality && (
              <p className="text-red-500 text-sm mt-1">
                {errors.modality.message as string}
              </p>
            )}
          </div>

          {serverError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
              {isSubmitting ? (
                "Finalizando..."
              ) : (
                <>
                  <Plus className="w-5 h-5" /> Criar e Ir para Dashboard
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
