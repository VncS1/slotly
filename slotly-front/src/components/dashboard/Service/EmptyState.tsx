import { CalendarDays, Plus } from "lucide-react";

export function EventTypesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
        <CalendarDays size={32} />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Nenhum tipo de evento criado
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-8">
        Crie seu primeiro serviço para que seus clientes possam começar a
        agendar horários com você.
      </p>

      <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95">
        <Plus size={20} />
        Criar Novo Serviço
      </button>
    </div>
  );
}
