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
        // 1. Setup inicial (Mantido o seu padrão)
        $catBarber = Category::firstOrCreate(['slug' => 'barbearia'], ['name' => 'Barbearia']);

        $provider = User::updateOrCreate(
            ['email' => 'provider@teste.com'],
            [
                'name' => 'João Barbeiro',
                'password' => Hash::make('12345678'),
                'phone' => '11999999999',
                'role' => 'provider',
                'business_name' => 'Barbearia do João',
                'business_slug' => 'barbearia-do-joao',
                'onboarding_complete' => true,
            ]
        );

        $provider->categories()->sync([$catBarber->id]);

        foreach (range(1, 5) as $day) {
            ScheduleConfig::updateOrCreate(
                ['user_id' => $provider->id, 'day_of_week' => $day],
                [
                    'start_time' => '09:00:00',
                    'end_time' => '18:00:00',
                    'lunch_start_time' => '12:00:00',
                    'lunch_end_time' => '13:00:00',
                ]
            );
        }

        $corte = Service::updateOrCreate(
            ['user_id' => $provider->id, 'name' => 'Corte Masculino'],
            ['description' => 'Corte com máquina e tesoura', 'duration_minutes' => 30, 'price' => 35.00, 'is_active' => true]
        );

        $barba = Service::updateOrCreate(
            ['user_id' => $provider->id, 'name' => 'Barba'],
            ['description' => 'Barba tradicional', 'duration_minutes' => 20, 'price' => 25.00, 'is_active' => true]
        );

        // 2. Criação de Clientes (Mais fácil de gerenciar em array)
        $clients = [];
        $clientData = [
            ['email' => 'maria@cliente.com', 'name' => 'Maria Silva'],
            ['email' => 'jose@cliente.com', 'name' => 'José Santos'],
            ['email' => 'ana@cliente.com', 'name' => 'Ana Oliveira'],
            ['email' => 'carlos@cliente.com', 'name' => 'Carlos Ferreira'],
        ];

        foreach ($clientData as $data) {
            $clients[] = User::firstOrCreate(
                ['email' => $data['email']],
                ['name' => $data['name'], 'password' => Hash::make('12345678'), 'role' => 'client']
            );
        }

        // --- MÃO NA MASSA: GERADOR DE VOLUME PARA PAGINAÇÃO ---

        $statuses = ['active', 'pending', 'completed', 'canceled'];
        $services = [$corte->id, $barba->id];

        // Vamos criar 40 agendamentos para garantir várias páginas
        foreach (range(1, 40) as $index) {
            $isPast = $index <= 20; // Metade no passado, metade no futuro
            
            // Gera uma data aleatória
            $date = $isPast 
                ? Carbon::now()->subDays(rand(1, 15)) 
                : Carbon::now()->addDays(rand(1, 15));
            
            $startTime = $date->setHour(rand(9, 17))->setMinute(0)->setSecond(0);
            
            Appointment::create([
                'provider_id' => $provider->id,
                'client_id'   => $clients[array_rand($clients)]->id,
                'service_id'  => $services[array_rand($services)],
                'start_time'  => $startTime,
                'end_time'    => (clone $startTime)->addMinutes(30),
                'status'      => $isPast ? 'completed' : $statuses[array_rand(['active', 'pending'])],
                'notes'       => "Agendamento de teste número $index",
            ]);
        }
    }
}