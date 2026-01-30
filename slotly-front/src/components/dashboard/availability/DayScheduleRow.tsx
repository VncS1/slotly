import { Trash2, Plus } from "lucide-react";
import type { ScheduleConfig } from "../../../types/ScheduleConfigTypes";
import { isValidTimeRange } from "../../../utils/timeValidation";

interface DayScheduleRowProps {
  dayName: string;
  dayIndex: number;
  config?: ScheduleConfig;
  onChange: (newConfig: ScheduleConfig) => void;
  onDelete: () => void;
}

export function DayScheduleRow({
  dayName,
  dayIndex,
  config,
  onChange,
  onDelete,
}: DayScheduleRowProps) {
  const isOpen = !!config;

  const timeError =
    config && !isValidTimeRange(config.start_time, config.end_time);

  const handleToggle = () => {
    if (isOpen) {
      onDelete();
    } else {
      onChange({
        day_of_week: dayIndex,
        start_time: "09:00",
        end_time: "18:00",
        lunch_start_time: "12:00",
        lunch_end_time: "13:00",
      });
    }
  };

  const updateField = (field: keyof ScheduleConfig, value: string | null) => {
    if (config) {
      onChange({ ...config, [field]: value });
    }
  };

  return (
    <div
      className={`flex flex-col border-b border-gray-50 last:border-0 transition-colors ${timeError ? "bg-red-50/50" : "hover:bg-gray-50/50"}`}
    >
      <div className="flex items-center gap-6 p-4">
        <div className="flex items-center gap-4 w-40">
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isOpen ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOpen ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`font-bold ${isOpen ? "text-gray-900" : "text-gray-400"}`}
          >
            {dayName}
          </span>
        </div>

        <div className="flex-1 flex items-center gap-3">
          {!isOpen ? (
            <span className="text-gray-400 italic text-sm">Indisponível</span>
          ) : (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={config.start_time}
                  onChange={(e) => updateField("start_time", e.target.value)}
                  className={`rounded-lg text-sm focus:ring-blue-500 ${timeError ? "border-red-300" : "border-gray-200"}`}
                />
                <span className="text-gray-400">—</span>
                <input
                  type="time"
                  value={config.end_time}
                  onChange={(e) => updateField("end_time", e.target.value)}
                  className={`rounded-lg text-sm focus:ring-blue-500 ${timeError ? "border-red-300" : "border-gray-200"}`}
                />
              </div>

              <div className="h-4 w-[1px] bg-gray-200 mx-2" />

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Almoço:
                </span>
                <input
                  type="time"
                  value={config.lunch_start_time || ""}
                  onChange={(e) =>
                    updateField("lunch_start_time", e.target.value)
                  }
                  className="rounded-lg border-gray-200 text-sm focus:ring-blue-500 opacity-60 hover:opacity-100 transition-opacity"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="time"
                  value={config.lunch_end_time || ""}
                  onChange={(e) =>
                    updateField("lunch_end_time", e.target.value)
                  }
                  className="rounded-lg border-gray-200 text-sm focus:ring-blue-500 opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <Plus size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-300 hover:text-red-500 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {timeError && (
        <div className="px-4 pb-3 ml-44">
          <span className="text-red-500 text-xs font-medium">
            O horário de término deve ser posterior ao horário de início.
          </span>
        </div>
      )}
    </div>
  );
}
