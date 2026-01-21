<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    // Listar todos os serviços DO USUÁRIO LOGADO
    public function index(Request $request)
    {
        return $request->user()->services;
    }

    // Criar um novo serviço
    public function store(Request $request)
    {
        // 1. Validação
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:5',
            'price' => 'required|numeric|min:0',
        ]);

        // 2. Criação (O Laravel preenche o user_id automaticamente com o relacionamento)
        $service = $request->user()->services()->create($validated);

        return response()->json($service, 201);
    }
    
    // Deletar um serviço
    public function destroy(Request $request, string $id)
    {
        // Busca o serviço garantindo que pertence ao usuário logado (Segurança)
        $service = $request->user()->services()->findOrFail($id);
        
        $service->delete();
        
        return response()->json(['message' => 'Serviço removido']);
    }
}