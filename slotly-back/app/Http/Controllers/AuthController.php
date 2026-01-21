<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        //return response()->json($request->all());

        // 1. Validar os dados de entrada
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Tentar autenticar
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciais inválidas'
            ], 401);
        }

        // 3. Se deu certo, gerar o Token
        $user = Auth::user();
        
        // Removemos tokens antigos para não acumular lixo no banco (opcional, mas boa prática)
        $user->tokens()->delete();
        
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Retornar Token e dados do User (para o front saber se é provider ou client)
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        // Revoga o token atual
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Deslogado com sucesso']);
    }
}