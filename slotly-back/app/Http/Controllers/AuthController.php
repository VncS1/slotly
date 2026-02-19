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

        $role = $fields['role'] ?? 'client';

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'business_name' => $fields['business_name'] ?? null,
            'role' => $role,
            'onboarding' => ($role === 'client' ? 1 : 0),
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
        $user = $request->user();


        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:1000',
            'profile_photo_path' => 'image|max:2048|mimes:jpg,png,jpeg|nullable',
            'current_password' => 'nullable|required_with:new_password',
            'new_password' => 'nullable|min:8|confirmed',
        ]);

        if ($request->hasFile('profile_photo_path')) {
            $caminho = $request->file('profile_photo_path')->store('pfp', 'public');
            $user->profile_photo_path = $caminho;
        }

        if ($request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['message' => 'Senha atual incorreta'], 422);
            }
            $user->password = Hash::make($request->new_password);
        }

        $user->fill([
            'name' => $validatedData['name'],
            'phone' => $validatedData['phone'] ?? $user->phone,
            'bio' => $validatedData['bio'] ?? $user->bio,
        ]);

        $user->save();

        return response()->json([
            'message' => 'Perfil atualizado com sucesso!',
            'user' => $user->fresh()
        ]);
    }
}
