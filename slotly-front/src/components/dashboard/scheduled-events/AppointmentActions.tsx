import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical, CheckCircle, XCircle } from 'lucide-react'; // Exemplo de ícones

interface AppointmentActionsProps {
  appointmentId: number;
  currentStatus: string;
}

export function AppointmentActions({ appointmentId }: AppointmentActionsProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors outline-none">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          align="end"
          className="z-50 min-w-[160px] bg-white rounded-lg shadow-xl border border-gray-100 p-1 animate-in fade-in zoom-in duration-200"
        >
          <DropdownMenu.Item 
            onClick={() => console.log('Finalizar', appointmentId)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 outline-none cursor-pointer rounded-md"
          >
            <CheckCircle className="w-4 h-4" />
            Finalizar Serviço
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-[1px] bg-gray-100 my-1" />

          <DropdownMenu.Item 
            onClick={() => console.log('Cancelar', appointmentId)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 outline-none cursor-pointer rounded-md"
          >
            <XCircle className="w-4 h-4" />
            Cancelar
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}