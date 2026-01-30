import { Calendar, Trash2 } from "lucide-react";
import type { DateOverride } from "../../../types/DateOverride";

interface DateOverrideItemProps {
  override: DateOverride;
  onDelete: () => void;
}

export function DateOverrideItem({
  override,
  onDelete,
}: DateOverrideItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-white text-blue-600 rounded-lg shadow-sm">
          <Calendar size={20} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{override.title}</h4>
          <p className="text-sm text-gray-500">
            {new Date(override.date).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {override.is_closed ? (
          <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-extrabold rounded-full uppercase tracking-widest">
            Fechado
          </span>
        ) : (
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-700">
              {override.start_time} — {override.end_time}
            </span>
          </div>
        )}

        <button
          onClick={onDelete}
          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
