<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ProviderController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'provider');

        $query->when($request->filled('search'), function ($q) use ($request) {
            $searchTerm = '%' . $request->search . '%';

            $q->where(function ($subQuery) use ($searchTerm) {
                $subQuery->where('name', 'like', $searchTerm)
                    ->orWhere('business_name', 'like', $searchTerm)
                    ->orWhere('business_slug', 'like', $searchTerm);
            });
        });

        $query->when($request->filled('category'), function ($q) use ($request) {
            $q->where('category', $request->category);
        });

        $providers = $query->paginate(12);

        return response()->json($providers);
    }

    public function show($slug)
    {
        // 1. Buscamos o usuário provider pelo slug
        // 2. Trazemos os 'services', mas APENAS os que estão ativos!
        $provider = User::where('role', 'provider')
            ->where('business_slug', $slug)
            ->with(['services' => function ($query) {
                $query->where('is_active', true);
            }])
            ->firstOrFail();

        return response()->json([
            'user' => [
                'id' => $provider->id,
                'name' => $provider->name,
                'business_slug' => $provider->business_slug,
                'profile_photo_path' => $provider->profile_photo_path ? asset('storage/' . $provider->profile_photo_path) : null,
                'bio' => $provider->bio,
            ],
            
            'services' => $provider->services 
        ]);
    }
}