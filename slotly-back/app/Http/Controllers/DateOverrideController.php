<?php

namespace App\Http\Controllers;

use App\Models\DateOverride;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DateOverrideController extends Controller
{
    /**
     * Lista todas as exceções futuras do usuário.
     */
    public function index(Request $request)
    {

        return $request->user()->dateOverrides()
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date', 'asc')
            ->get();
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'date' => 'required|date|after_or_equal:today',
            'is_closed' => 'required|boolean',

            'start_time' => 'required_if:is_closed,false|nullable|date_format:H:i',
            'end_time' => 'required_if:is_closed,false|nullable|date_format:H:i|after:start_time',
        ]);

        try {

            $override = $request->user()->dateOverrides()->updateOrCreate(
                ['date' => $validated['date']],
                $validated
            );

            return response()->json($override, 201);
        } catch (\Exception $e) {
            Log::error("Erro ao salvar exceção de data: " . $e->getMessage());
            return response()->json(['message' => 'Erro ao processar a exceção.'], 500);
        }
    }

    /**
     * Remove uma exceção e volta o dia para a disponibilidade padrão.
     */
    public function destroy(Request $request, DateOverride $dateOverride)
    {

        if ($dateOverride->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $dateOverride->delete();

        return response()->json(['message' => 'Exceção removida com sucesso.']);
    }
}