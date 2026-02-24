<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\DateOverride;
use App\Models\ScheduleConfig;
use App\Models\Appointment;

use Carbon\Carbon;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->services()->select('id', 'name', 'duration_minutes', 'modality', 'price', 'is_active')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:5',
            'price' => 'required|numeric|min:0',
            'modality' => 'required|in:online,in_person',
        ]);

        $service = $request->user()->services()->create($validated);

        $user = $request->user();

        if (!$user->onboarding_complete) {
            $user->onboarding_complete = true;
            $user->save();
        }

        return response()->json($service, 201);
    }

    public function update(Request $request, Service $service)
    {
        if ($service->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'sometimes|integer|min:5',
            'price' => 'sometimes|numeric|min:0',
            'modality' => 'sometimes|in:online,in_person',
            'is_active' => 'sometimes|boolean',
        ]);

        $service->update($validated);

        return response()->json($service);
    }

    public function destroy(Request $request, Service $service)
    {
        if ($service->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Ação não autorizada.'], 403);
        }

        $service->delete();

        return response()->json(['message' => 'Serviço removido com sucesso.']);
    }

    public function show($id)
    {
        $service = Service::where('id', $id)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($service);
    }

    public function availability(Request $request, $id)
    {
        $request->validate(['date' => 'required|date_format:Y-m-d']);
        $requestedDate = $request->query('date');

        $service = Service::where('id', $id)->where('is_active', true)->firstOrFail();
        $providerId = $service->user_id;
        $duration = $service->duration_minutes;

        $baseDate = Carbon::parse($requestedDate);
        $dayOfWeek = $baseDate->dayOfWeekIso;

        $schedule = ScheduleConfig::where('user_id', $providerId)->where('day_of_week', $dayOfWeek)->first();
        if (!$schedule) {
            return response()->json([]);
        }

        $existingAppointments = Appointment::where('provider_id', $providerId)
            ->whereDate('start_time', $requestedDate)
            ->whereIn('status', ['active', 'pending'])
            ->get();

        $availableSlots = [];
        $currentSlot = $baseDate->copy()->setTimeFromTimeString($schedule->start_time);
        $endOfDay = $baseDate->copy()->setTimeFromTimeString($schedule->end_time);

        $lunchStart = $schedule->lunch_start_time ? $baseDate->copy()->setTimeFromTimeString($schedule->lunch_start_time) : null;
        $lunchEnd = $schedule->lunch_end_time ? $baseDate->copy()->setTimeFromTimeString($schedule->lunch_end_time) : null;

        while ($currentSlot->copy()->addMinutes($duration)->lte($endOfDay)) {
            $slotStart = $currentSlot->copy();
            $slotEnd = $currentSlot->copy()->addMinutes($duration);

            $isInLunch = false;
            if ($lunchStart && $lunchEnd) {
                $isInLunch = $slotStart->lt($lunchEnd) && $slotEnd->gt($lunchStart);
            }

            $isOccupied = $existingAppointments->contains(function ($appointment) use ($slotStart, $slotEnd) {
        
                $appStartTime = Carbon::parse($appointment->start_time)->format('H:i:s');
                $appEndTime = Carbon::parse($appointment->end_time)->format('H:i:s');
        
                $appStart = $slotStart->copy()->setTimeFromTimeString($appStartTime);
                $appEnd = $slotStart->copy()->setTimeFromTimeString($appEndTime);

        
                return $slotStart->lt($appEnd) && $slotEnd->gt($appStart);
            });

            if (!$isInLunch) {
                $availableSlots[] = [
                    'time' => $slotStart->format('H:i'),
                    'available' => !$isOccupied
                ];
            }

            $currentSlot->addMinutes($duration);
        }

        return response()->json($availableSlots);
    }
}