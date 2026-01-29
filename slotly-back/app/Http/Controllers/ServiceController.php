<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

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
            'is_active' => 'sometimes|boolean', // Permitimos o toggle também
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
}