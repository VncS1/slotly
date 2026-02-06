import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Puzzle, Zap, Globe, ArrowLeft, Rocket } from "lucide-react";

export const Route = createFileRoute("/_dashboard/integrations")({
  component: IntegrationsPage,
});

export function IntegrationsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl w-full text-center relative">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-100 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-60 animate-pulse delay-700" />

        <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-12 relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg mb-8 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Puzzle size={40} />
          </div>

          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Ecossistema de Conexões
          </h1>

          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Estamos afinando nossas engrenagens para permitir que o{" "}
            <strong>Slotly</strong> se conecte com suas ferramentas favoritas
            como Google Calendar, WhatsApp e Stripe.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-12 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center gap-2">
              <Zap className="text-orange-500" />
              <span className="text-xs font-bold uppercase text-gray-400">
                Automações
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center gap-2">
              <Globe className="text-blue-500" />
              <span className="text-xs font-bold uppercase text-gray-400">
                Webhooks
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center gap-2">
              <Rocket className="text-purple-500" />
              <span className="text-xs font-bold uppercase text-gray-400">
                API Aberta
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() =>
                navigate({
                  to: "/scheduled-events",
                  search: { status: "upcoming", page: 1 },
                })
              }
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-95"
            >
              <ArrowLeft size={18} />
              Voltar ao Painel
            </button>

            <div className="px-6 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100 animate-bounce sm:animate-none">
              🚀 Lançamento em breve
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-400 italic">
          Nossos robôs estão trabalhando duro (e bebendo muito café) nisso.
        </p>
      </div>
    </div>
  );
}
