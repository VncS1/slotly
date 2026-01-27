import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { Plus, Trash2, Clock, DollarSign } from "lucide-react";
import { serviceSchema, type ServiceFormValues } from "./-schema3";

export const Route = createFileRoute("/onboarding/3")({
  beforeLoad: () => {
    if (!localStorage.getItem("slotly_token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: OnboardingStep3,
});

type ServiceItem = ServiceFormValues & { id: number };

function OnboardingStep3() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: { modality: "online" }, // Valor padrão do enum
  });

  // 2. GET: Buscar serviços existentes ao carregar a tela
  useEffect(() => {
    api.get("/services").then((res) => setServices(res.data));
  }, []);

  // 3. POST: Enviar novo serviço para o Backend
  const onSubmit = async (data: ServiceFormValues) => {
    try {
      const response = await api.post("/services", data);
      setServices([...services, response.data]); // Atualiza a lista visualmente
      reset(); // Limpa o formulário
    } catch (error) {
      console.error("Erro ao criar serviço", error);
      alert("Erro ao criar serviço. Verifique o console.");
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/services/${id}`);
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          O que você oferece?
        </h1>
        <p className="text-gray-500">
          Cadastre seus serviços e defina se são online ou presenciais.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ESQUERDA: Formulário de Cadastro */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <h2 className="font-semibold mb-4 text-lg">Novo Serviço</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Serviço
              </label>
              <input
                {...register("name")}
                placeholder="Ex: Consultoria Rápida"
                className="w-full p-2 border rounded-lg mt-1"
              />
              {errors.name && (
                <span className="text-red-500 text-xs">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Preço (R$)
                </label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    {...register("price")}
                    className="w-full pl-8 p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Duração (min)
                </label>
                <div className="relative mt-1">
                  <Clock className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    {...register("duration_minutes")}
                    className="w-full pl-8 p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* O Campo MODALITY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidade
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="border rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input
                    type="radio"
                    value="online"
                    {...register("modality")}
                    className="accent-blue-600"
                  />
                  <span>Online 🌐</span>
                </label>
                <label className="border rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input
                    type="radio"
                    value="in_person"
                    {...register("modality")}
                    className="accent-blue-600"
                  />
                  <span>Presencial 📍</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Adicionar Serviço
            </button>
          </form>
        </div>

        {/* DIREITA: Lista de Exibição */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-gray-900">
            Seus Serviços Ativos
          </h2>
          {services.length === 0 && (
            <p className="text-gray-400 text-center py-10 italic">
              Nenhum serviço cadastrado ainda.
            </p>
          )}

          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center group"
            >
              <div>
                <h3 className="font-bold text-gray-900">{service.name}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {service.duration_minutes} min
                  </span>
                  <span className="flex items-center gap-1 font-medium text-green-600">
                    R$ {service.price}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      service.modality === "online"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {service.modality === "online" ? "Online" : "Presencial"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(service.id)}
                className="text-gray-400 hover:text-red-500 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
