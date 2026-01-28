import { Plus } from "lucide-react";

interface EventTypesHeaderProps {
  onOpenModal: () => void;
}

export function EventTypesHeader({ onOpenModal }: EventTypesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Tipos de Serviços
        </h1>
        <p className="text-gray-500 mt-1">
          Configure os serviços e durações que seus clientes podem agendar.
        </p>
      </div>

      <button
        onClick={onOpenModal}
        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95"
      >
        <Plus size={20} strokeWidth={3} />
        Novo Serviço
      </button>
    </div>
  );
}
