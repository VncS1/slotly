<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['client', 'service'])
            ->where('provider_id', Auth::id());

        if ($request->status === 'upcoming') {
            $query->where('start_time', '>=', now())->where('status', 'active');
        } elseif ($request->status === 'past') {
            $query->where('start_time', '<', now());
        }

        return $query->orderBy('start_time', 'asc')
            ->paginate($request->get('per_page', 10));
    }

    private function applyStatusFilters($query, $status)
    {
        switch ($status) {
            case 'upcoming':

                $query->where('start_time', '>=', now())
                    ->where('status', 'active');
                break;

            case 'pending':

                $query->where('status', 'pending');
                break;

            case 'past':

                $query->where('start_time', '<', now());
                break;
        }
    }

    private function applyDateRangeFilters($query, $request)
    {
        if ($request->has(['start_date', 'end_date'])) {
            $start = Carbon::parse($request->start_date)->startOfDay();
            $end = Carbon::parse($request->end_date)->endOfDay();

            $query->whereBetween('start_time', [$start, $end]);
        }
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|date_format:H:i',
        ]);

        $service = Service::findOrFail($validated['service_id']);

        $start = Carbon::parse($validated['date'] . ' ' . $validated['time']);
        $end = $start->copy()->addMinutes($service->duration_minutes);



        $isOccupied = Appointment::where('provider_id', $service->user_id)
            ->where('status', 'active')
            ->where(function ($query) use ($start, $end) {


                $query->whereBetween('start_time', [$start, $end->copy()->subSecond()])
                    ->orWhereBetween('end_time', [$start->copy()->addSecond(), $end]);
            })
            ->exists();

        if ($isOccupied) {

            return response()->json([
                'message' => 'Desculpe, este horário foi preenchido recentemente.'
            ], 422);
        }

        $appointment = Appointment::create([
            'provider_id' => $service->user_id,
            'client_id' => Auth::id(),
            'service_id' => $service->id,
            'start_time' => $start,
            'end_time' => $end,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Agendamento realizado com sucesso!',
            'data' => $appointment
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {

        $request->validate([
            'status' => 'required|in:active,completed,canceled'
        ]);


        $appointment = Appointment::where('id', $id)
            ->where('provider_id', Auth::id())
            ->firstOrFail();


        $appointment->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Status atualizado com sucesso!',
            'data' => $appointment
        ]);
    }

    public function clientIndex(Request $request)
    {
        $nowString = now()->toDateTimeString();

        $query = Appointment::with(['service', 'service.provider'])
            ->where('client_id', Auth::id());

        if ($request->status === 'upcoming') {
            $query->where('start_time', '>=', $nowString)
                ->whereIn('status', ['active', 'pending'])
                ->orderBy('start_time', 'asc');
        } else {
            $query->where(function ($q) use ($nowString) {
                $q->where('start_time', '<', $nowString)
                    ->orWhereIn('status', ['completed', 'canceled']);
            })
                ->orderBy('start_time', 'desc');
        }

        return response()->json($query->get());
    }

    public function cancel($id)
    {
        $appointment = Appointment::where('id', $id)
            ->where('client_id', Auth::id())
            ->firstOrFail();

        $appointment->update(['status' => 'canceled']);

        return response()->json(['message' => 'Agendamento cancelado com sucesso.']);
    }
}
