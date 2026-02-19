import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  PhoneCall,
  Users,
  Video,
  Briefcase,
  Loader2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

import { api } from "../../lib/api";

export const Route = createFileRoute("/_client/$providerSlug")({
  component: ProviderProfile,
});

function getServiceIcon(name: string) {
  const lowerName = name.toLowerCase();
  if (
    lowerName.includes("call") ||
    lowerName.includes("ligação") ||
    lowerName.includes("consulta")
  )
    return <PhoneCall size={20} />;
  if (lowerName.includes("strategy") || lowerName.includes("estratégia"))
    return <Users size={20} />;
  if (lowerName.includes("video") || lowerName.includes("online"))
    return <Video size={20} />;
  return <Briefcase size={20} />;
}

function ProviderProfile() {
  const { providerSlug } = Route.useParams();

  const {
    data: providerData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["provider-profile", providerSlug],
    queryFn: async () => {
      const response = await api.get(`/providers/${providerSlug}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-[#20C997]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Carregando agenda...</p>
      </div>
    );
  }

  if (isError || !providerData) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-red-50 border border-red-100 p-8 rounded-3xl flex flex-col items-center text-center">
        <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Profissional não encontrado
        </h2>
        <p className="text-gray-600 mb-6 font-medium">
          A URL pode estar incorreta ou o profissional desativou a conta.
        </p>
        <Link
          to="/"
          className="text-[#20C997] font-bold hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Voltar para a busca
        </Link>
      </div>
    );
  }

  const { user, services } = providerData;
  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : "PR";

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <div className="max-w-3xl mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar para busca
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-12 flex flex-col items-center text-center">
          {user.profile_photo_path ? (
            <img
              src={user.profile_photo_path}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-6"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-black text-gray-400 border-4 border-white shadow-lg mb-6">
              {initials}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 tracking-tight">
            {user.name}
          </h1>
          <p className="text-gray-500 font-medium leading-relaxed max-w-lg">
            {user.bio ||
              "Profissional disponível para agendamentos. Escolha um dos serviços abaixo para reservar seu horário."}
          </p>
        </div>

        <hr className="border-gray-50" />

        <div className="p-8 sm:p-12 bg-gray-50/50">
          <h2 className="text-lg font-black text-gray-900 mb-6">
            Agende uma sessão
          </h2>

          {services && services.length > 0 ? (
            <div className="space-y-4">
              {services.map((service: any) => (
                <Link
                  key={service.id}
                  to={`/book/${service.id}`}
                  className="group flex items-center p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#20C997]/30 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-[#20C997]/10 group-hover:text-[#20C997] transition-colors mr-5">
                    {getServiceIcon(service.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#20C997] transition-colors truncate">
                      {service.name}
                    </h3>
                    <div className="text-sm font-medium text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{service.duration_minutes} min</span>
                      <span className="text-gray-300">•</span>
                      <span>
                        {service.price > 0 ? `R$ ${service.price}` : "Gratuito"}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="capitalize text-[#20C997]">
                        {service.modality === "online"
                          ? "Online"
                          : "Presencial"}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-300 group-hover:text-[#20C997] group-hover:translate-x-1 transition-all">
                    <ChevronRight size={24} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 font-medium bg-white rounded-2xl border border-dashed border-gray-200">
              Este profissional ainda não possui serviços ativos no momento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
