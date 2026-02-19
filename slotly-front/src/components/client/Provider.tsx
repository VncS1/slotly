import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import type { ProviderSummary } from "../../types/Provider";

interface ProviderCardProps {
  provider: ProviderSummary;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const initials = provider.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const categoryName = provider.category?.name || "Geral";

  return (
    <Link
      to="/$providerSlug"
      params={{ providerSlug: provider.business_slug }}
      className="group block bg-white border border-gray-200 rounded-[24px] p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#20C997]/10 rounded-bl-full -translate-y-full translate-x-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 ease-out" />

      <div className="relative flex items-start gap-4">
        <div className="shrink-0">
          {provider.avatar_url ? (
            <img
              src={provider.avatar_url}
              alt={provider.name}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm group-hover:border-[#20C997] transition-colors"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-100 flex items-center justify-center text-lg font-black text-gray-400 group-hover:border-[#20C997] group-hover:text-[#20C997] transition-colors">
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <span className="inline-block py-0.5 px-2 rounded-full bg-[#20C997]/10 text-[#18A078] text-[11px] font-bold uppercase tracking-wider mb-2">
            {categoryName}
          </span>

          <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 truncate group-hover:text-[#20C997] transition-colors">
            {provider.name}
          </h3>

          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 font-medium">
            {provider.bio || "Profissional disponível para agendamentos."}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-gray-400 font-medium">
          <MapPin size={16} />
          <span>Atendimento Online/Local</span>
        </div>

        <div className="flex items-center gap-1 text-[#20C997] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <span>Ver agenda</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}
