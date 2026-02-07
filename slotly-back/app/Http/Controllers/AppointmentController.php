<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
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
}
