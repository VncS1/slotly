import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingCalendarProps {
  serviceId: string;
}

export function BookingCalendar({ serviceId }: BookingCalendarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: service,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: async () => {
      const response = await api.get(`/services/${serviceId}`);
      return response.data;
    },
  });

  const [currentMonth, setCurrentMonth] = useState(startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const formattedDate = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  const { data: dynamicAvailableTimes, isLoading: isLoadingTimes } = useQuery<
    TimeSlot[]
  >({
    queryKey: ["availability", serviceId, formattedDate],
    queryFn: async () => {
      const response = await api.get(`/services/${serviceId}/availability`, {
        params: { date: formattedDate },
      });
      return response.data;
    },
    enabled: !!selectedDate,
  });

  const { mutate: createAppointment, isPending: isBooking } = useMutation({
    mutationFn: async () => {
      return await api.post("/appointments", {
        service_id: serviceId,
        date: formattedDate,
        time: selectedTime,
      });
    },
    onSuccess: () => {
      alert("Agendamento realizado com sucesso!");
      router.navigate({ to: "/" });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      setSelectedTime(null);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erro ao realizar agendamento.";
      alert(message);
    },
  });

  const availableTimes = dynamicAvailableTimes || [];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });
    const today = startOfDay(new Date());

    return daysInterval.map((day) => {
      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
      const isPast = isBefore(day, today);
      const isCurrentMonth = isSameMonth(day, monthStart);

      return (
        <button
          key={day.toString()}
          onClick={() => {
            setSelectedDate(day);
            setSelectedTime(null);
          }}
          disabled={isPast || !isCurrentMonth}
          className={`aspect-square flex items-center justify-center text-sm rounded-xl transition-all duration-200 ${
            !isCurrentMonth
              ? "opacity-0 cursor-default"
              : isSelected
                ? "bg-[#20C997] text-white font-bold shadow-md shadow-[#20C997]/30"
                : isPast
                  ? "text-gray-300 cursor-not-allowed font-medium"
                  : "text-gray-700 hover:bg-gray-100 font-medium"
          }`}
        >
          {format(day, "d")}
        </button>
      );
    });
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  if (isError || !service) return <div>Erro ao carregar serviço.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
          Selecione a Data e Horário
        </h1>
        <p className="text-gray-500 font-medium">
          Encontre o horário que melhor se adapta à sua rotina.
        </p>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row md:h-[600px] overflow-hidden">
        {/* COLUNA 1: Resumo (Visual Inalterado) */}
        <div className="w-full md:w-[30%] p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30 flex flex-col">
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-8">
            Resumo do Agendamento
          </h2>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1 font-medium">
              Serviço Selecionado
            </p>
            <h3 className="text-2xl font-black text-gray-900 mb-8 leading-tight">
              {service.name}
            </h3>
            <div className="space-y-5 text-sm text-gray-600 font-medium mb-8 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#20C997]" />{" "}
                {service.duration_minutes} minutos
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-[#20C997]" /> R${" "}
                {Number(service.price).toFixed(2).replace(".", ",")}
              </div>
            </div>
          </div>
          <button
            onClick={() => router.history.back()}
            className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Trocar Serviço
          </button>
        </div>

        {/* COLUNA 2: Calendário (Visual Inalterado) */}
        <div className="w-full md:w-[40%] p-8 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-gray-900">
              1. Escolha uma Data
            </h2>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="min-w-[120px] text-center capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>
          <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
        </div>

        {/* COLUNA 3: Horários Disponíveis (AQUI ESTÁ A MUDANÇA) */}
        <div className="w-full md:w-[30%] p-8 flex flex-col bg-white overflow-hidden">
          <h2 className="text-lg font-bold text-gray-900 mb-6 shrink-0">
            2. Horários Disponíveis
          </h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {!selectedDate ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400 font-medium text-center px-4">
                Selecione uma data para ver os horários.
              </div>
            ) : isLoadingTimes ? (
              <div className="h-full flex items-center justify-center text-sm text-[#20C997] font-medium animate-pulse">
                Buscando horários...
              </div>
            ) : availableTimes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-500 font-medium text-center px-4">
                Poxa, nenhum horário livre neste dia.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {availableTimes.map(
                  (slot: { time: string; available: boolean }) => {
                    const isSelected = selectedTime === slot.time;
                    const isBusy = !slot.available; // Aqui identificamos se o horário está ocupado no banco

                    return (
                      <button
                        key={slot.time}
                        disabled={isBusy}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`w-full py-3 px-4 border rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? "border-[#20C997] bg-[#20C997]/10 text-[#20C997]"
                            : isBusy
                              ? "border-red-100 bg-red-50 text-red-400 cursor-not-allowed opacity-80" // COR VERMELHA PARA OCUPADO
                              : "border-gray-100 text-gray-600 hover:border-[#20C997]/50 hover:bg-gray-50"
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isBusy && (
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            Ocupado
                          </span>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>

          <div className="pt-6 mt-4 border-t border-gray-50 shrink-0">
            <button
              disabled={!selectedDate || !selectedTime || isBooking}
              onClick={() => createAppointment()}
              className="w-full py-4 px-4 bg-[#20C997] hover:bg-[#18A078] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#20C997]/20"
            >
              {isBooking ? "Processando..." : "Confirmar Seleção"}{" "}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
