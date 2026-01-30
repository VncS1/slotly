<?php 
namespace App\Http\Controllers;

use App\Models\ScheduleConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ScheduleConfigController extends Controller
{
    public function index(Request $request)
    {
        // Retornamos todas as configurações de horário do usuário logado
        return $request->user()->scheduleConfigs()->orderBy('day_of_week')->get();
    }

    public function store(Request $request)
    {
        // 1. Validação: Esperamos um array de horários
        $validated = $request->validate([
            'schedules' => 'required|array|min:1|max:7',
            'schedules.*.day_of_week' => 'required|integer|between:0,6',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
            'schedules.*.lunch_start_time' => 'nullable|date_format:H:i',
            'schedules.*.lunch_end_time' => 'nullable|date_format:H:i|after:schedules.*.lunch_start_time',
        ]);

        try {
            // 2. Iniciamos a Transação para garantir integridade
            return DB::transaction(function () use ($request, $validated) {
                $user = $request->user();
                $results = [];

                foreach ($validated['schedules'] as $scheduleData) {
                    // 3. Upsert: Se existir o par (user + dia), atualiza. Se não, cria.
                    $results[] = ScheduleConfig::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'day_of_week' => $scheduleData['day_of_week']
                        ],
                        $scheduleData
                    );
                }

                return response()->json([
                    'message' => 'Configurações de agenda atualizadas com sucesso!',
                    'data' => $results
                ], 200);
            });

        } catch (\Exception $e) {
            Log::error("Erro ao salvar agenda: " . $e->getMessage());
            return response()->json(['message' => 'Erro interno ao processar a agenda.'], 500);
        }
    }
}