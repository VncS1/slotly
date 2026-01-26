<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;

// --- Rotas Públicas (Qualquer um acessa) ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// --- Rotas Protegidas (Precisa estar logado) ---
// O middleware 'auth:sanctum' verifica se o Token é válido
Route::middleware('auth:sanctum')->group(function () {
    
    // Retorna dados do usuário logado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rota de Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rotas de Serviços (CRUD)
    // Isso cria automaticamente GET /services, POST /services, DELETE /services/{id}
    Route::apiResource('services', ServiceController::class);
});