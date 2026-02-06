import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { MoreVertical, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface AppointmentActionsProps {
  appointmentId: number;
  currentStatus: string;
}

export function AppointmentActions({
  appointmentId,
  currentStatus,
}: AppointmentActionsProps) {
  const queryClient = useQueryClient();

  const { mutateAsync: updateStatus, isPending } = useMutation({
    mutationFn: async (newStatus: "completed" | "canceled" | "active") => {
      await api.patch(`/appointments/${appointmentId}/status`, {
        status: newStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: () => {},
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          disabled={isPending}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors outline-none disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MoreVertical className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          align="end"
          className="z-50 min-w-[180px] bg-white rounded-lg shadow-xl border border-gray-100 p-1"
        >
          {currentStatus !== "completed" && (
            <DropdownMenu.Item
              onClick={() => updateStatus("completed")}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 outline-none cursor-pointer rounded-md"
            >
              <CheckCircle className="w-4 h-4" />
              Finalizar Serviço
            </DropdownMenu.Item>
          )}

          {currentStatus !== "canceled" && (
            <DropdownMenu.Item
              onClick={() => updateStatus("canceled")}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 outline-none cursor-pointer rounded-md"
            >
              <XCircle className="w-4 h-4" />
              Cancelar Agendamento
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
