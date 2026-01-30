import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { overrideSchema } from "./-schemaDateOverride";

export function DateOverrideForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(overrideSchema),
    defaultValues: {
      is_closed: true,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const isClosed = watch("is_closed");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Título da Exceção
        </label>
        <input
          {...register("title")}
          placeholder="Ex: Feriado Municipal"
          className="w-full rounded-lg border-gray-200"
        />
        {errors.title && (
          <span className="text-red-500 text-xs">
            {errors.title.message as string}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data
          </label>
          <input
            type="date"
            {...register("date")}
            className="w-full rounded-lg border-gray-200"
          />
        </div>
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("is_closed")}
              className="rounded text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">
              Dia Inteiro Fechado
            </span>
          </label>
        </div>
      </div>

      {!isClosed && (
        <div className="flex items-center gap-3 animate-in fade-in duration-200">
          <input
            type="time"
            {...register("start_time")}
            className="rounded-lg border-gray-200"
          />
          <span>até</span>
          <input
            type="time"
            {...register("end_time")}
            className="rounded-lg border-gray-200"
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
        >
          Adicionar Exceção
        </button>
      </div>
    </form>
  );
}
