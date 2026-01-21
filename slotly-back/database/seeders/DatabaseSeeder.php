<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use App\Models\ScheduleConfig;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $provider = User::create([
            'name' => 'Barbeiro Zé',
            'email' => 'barbeiro@teste.com',
            'password' => Hash::make('password'),
            'role' => 'provider',
        ]);

        Service::create([
            'user_id' => $provider->id,
            'name' => 'Corte de Cabelo',
            'duration_minutes' => 30,
            'price' => 50.00,
        ]);

        Service::create([
            'user_id' => $provider->id,
            'name' => 'Barba Completa',
            'duration_minutes' => 20,
            'price' => 30.00,
        ]);

        for ($day = 1; $day <= 5; $day++) {
            ScheduleConfig::create([
                'user_id' => $provider->id,
                'day_of_week' => $day,
                'start_time' => '09:00:00',
                'end_time' => '18:00:00',
                'lunch_start_time' => '12:00:00',
                'lunch_end_time' => '13:00:00',
            ]);
        }

        User::create([
            'name' => 'Cliente João',
            'email' => 'cliente@teste.com',
            'password' => Hash::make('password'),
            'role' => 'client',
        ]);
        
        echo "Banco de dados populado com sucesso! \n";
        echo "Login Prestador: barbeiro@teste.com / password \n";
    }
}