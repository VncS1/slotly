<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Category;
use App\Models\Service;
use App\Models\ScheduleConfig;
use App\Models\Appointment;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Criar Categorias Fixas
        $catBarber = Category::create(['name' => 'Barbearia', 'slug' => 'barbearia']);
        $catBeauty = Category::create(['name' => 'Beleza', 'slug' => 'beleza']);
        $catHealth = Category::create(['name' => 'Saúde', 'slug' => 'saude']);

        // 2. Criar um PRESTADOR (Provider)
        $provider = User::create([
            'name' => 'João Barbeiro',
            'email' => 'provider@teste.com',
            'password' => Hash::make('12345678'), // Senha padrão
            'phone' => '11999999999',
            'role' => 'provider',
            'business_name' => 'Barbearia do João',
            'business_slug' => 'barbearia-do-joao',
        ]);

        // 2.1 Vincular Provider à Categoria (Muitos-para-Muitos)
        $provider->categories()->attach($catBarber->id);

        // 2.2 Criar Configuração de Horário (Ex: Segunda-feira, 9h às 18h)
        ScheduleConfig::create([
            'user_id' => $provider->id,
            'day_of_week' => 1, // 0=Dom, 1=Seg...
            'start_time' => '09:00:00',
            'end_time' => '18:00:00',
            'lunch_start_time' => '12:00:00',
            'lunch_end_time' => '13:00:00',
        ]);

        // 3. Criar Serviços para esse Provider
        $corte = Service::create([
            'user_id' => $provider->id,
            'name' => 'Corte Masculino',
            'description' => 'Corte com máquina e tesoura',
            'duration_minutes' => 30,
            'price' => 35.00,
            'is_active' => true,
        ]);

        Service::create([
            'user_id' => $provider->id,
            'name' => 'Barba',
            'description' => 'Barba desenhada com toalha quente',
            'duration_minutes' => 20,
            'price' => 25.00,
            'is_active' => true,
        ]);

        // 4. Criar um CLIENTE
        $client = User::create([
            'name' => 'Maria Cliente',
            'email' => 'client@teste.com',
            'password' => Hash::make('12345678'),
            'role' => 'client',
            // business fields nulos
        ]);

        // 5. Criar um Agendamento de Teste
        Appointment::create([
            'provider_id' => $provider->id,
            'client_id' => $client->id,
            'service_id' => $corte->id,
            'start_time' => Carbon::tomorrow()->setHour(10)->setMinute(0), // Amanhã às 10:00
            'end_time' => Carbon::tomorrow()->setHour(10)->setMinute(30),  // Amanhã às 10:30
            'status' => 'confirmed',
            'notes' => 'Primeira visita',
        ]);
    }
}