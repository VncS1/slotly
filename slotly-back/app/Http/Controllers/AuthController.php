<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {



        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);


        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciais inválidas'
            ], 401);
        }


        $user = Auth::user();


        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;


        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {

        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Deslogado com sucesso']);
    }

    public function register(Request $request)
    {

        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|confirmed|min:6',
            'business_name' => 'nullable|string|max:255',
            'role' => 'required|string'
        ], [
            'email.unique' => 'Este e-mail já foi cadastrado em nosso sistema.',
            'email.email' => 'Por favor, insira um e-mail válido.',
            'password.confirmed' => 'As senhas não coincidem.',
            'password.min' => 'A senha deve ter pelo menos 6 caracteres.',
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'business_name' => $fields['business_name'] ?? null,
            'role' => $fields['role'] ?? 'client',
        ]);

        $token = $user->createToken('slotly_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token
        ], 201);
    }

    public function updateSlug(Request $request)
    {
        $fields = $request->validate([
            'business_slug' => 'required|string|min:3|max:50|alpha_dash|unique:users,business_slug'
        ], [

            'business_slug.unique' => 'Esta URL já está em uso. Por favor, escolha outra.',
            'business_slug.alpha_dash' => 'Use apenas letras, números e hífens.'
        ]);

        $user = $request->user();

        if ($user->business_slug) {
            return response()->json(['message' => 'Você já definiu sua URL.'], 403);
        }

        $user->update([
            'business_slug' => $fields['business_slug']
        ]);

        return response()->json([
            'message' => 'URL configurada com sucesso!',
            'user' => $user
        ]);
    }

    public function updateProfile(Request $request)
    {
        $fields = $request->validate([
            'profile_photo_path' => 'image|max:2048|mimes:jpg,png,jpeg|nullable',
            'bio' => 'nullable|string|max:1000'
        ], [
            'bio.max' => 'Biografia pode possuir no máximo 1000 caracteres!',
            'profile_photo_path.image' => 'O arquivo precisa conter uma imagem.',
            'profile_photo_path.mimes' => 'Utilize um dos formatos de imagem a seguir: jpg, png ou jpeg.',
            'profile_photo_path.max' => 'Imagem pode possuir no máximo 2mb.'
        ]);

        $user = $request->user();

        if ($request->hasFile('profile_photo_path')) {
            $caminho = $request->file('profile_photo_path')->store('pfp', 'public');

            $fields['profile_photo_path'] = $caminho;
        }

        $user->update($fields);
        
        return response()->json([
            'message' => 'Perfil atualizado com sucesso!',
            'user' => $user
        ]);
    }
}