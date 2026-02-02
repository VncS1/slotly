<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        
        $query = Appointment::with(['client', 'service'])
            ->where('provider_id', auth()->id());

        $this->applyStatusFilters($query, $request->query('status'));

        $this->applyDateRangeFilters($query, $request);

        return $query->orderBy('start_time', 'asc')
                     ->paginate(10)
                     ->withQueryString(); 
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
}