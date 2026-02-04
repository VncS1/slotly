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


        $client1 = User::firstOrCreate(['email' => 'maria@cliente.com'], ['name' => 'Maria Silva', 'password' => Hash::make('12345678'), 'role' => 'client']);
        $client2 = User::firstOrCreate(['email' => 'jose@cliente.com'], ['name' => 'José Santos', 'password' => Hash::make('12345678'), 'role' => 'client']);
        $client3 = User::firstOrCreate(['email' => 'ana@cliente.com'], ['name' => 'Ana Oliveira', 'password' => Hash::make('12345678'), 'role' => 'client']);




        Appointment::create([
            'provider_id' => $provider->id,
            'client_id' => $client1->id,
            'service_id' => $corte->id,
            'start_time' => Carbon::tomorrow()->setHour(10),
            'end_time' => Carbon::tomorrow()->setHour(10)->addMinutes(30),
            'status' => 'active',
            'notes' => 'Cliente nova, quer degradê.',
        ]);

        Appointment::create([
            'provider_id' => $provider->id,
            'client_id' => $client2->id,
            'service_id' => $barba->id,
            'start_time' => Carbon::tomorrow()->setHour(14),
            'end_time' => Carbon::tomorrow()->setHour(14)->addMinutes(20),
            'status' => 'active',
        ]);


        Appointment::create([
            'provider_id' => $provider->id,
            'client_id' => $client3->id,
            'service_id' => $corte->id,
            'start_time' => Carbon::now()->addDays(2)->setHour(11),
            'end_time' => Carbon::now()->addDays(2)->setHour(11)->addMinutes(30),
            'status' => 'pending',
            'notes' => 'Solicitou pelo app.',
        ]);


        Appointment::create([
            'provider_id' => $provider->id,
            'client_id' => $client1->id,
            'service_id' => $barba->id,
            'start_time' => Carbon::yesterday()->setHour(16),
            'end_time' => Carbon::yesterday()->setHour(16)->addMinutes(20),
            'status' => 'active',
        ]);


        Appointment::create([
            'provider_id' => $provider->id,
            'client_id' => $client2->id,
            'service_id' => $corte->id,
            'start_time' => Carbon::now()->addDays(3)->setHour(9),
            'end_time' => Carbon::now()->addDays(3)->setHour(9)->addMinutes(30),
            'status' => 'canceled',
            'notes' => 'Desistiu por motivo de viagem.',
        ]);

        Appointment::create([
            'provider_id' => $provider->id,
            'client_id' => $client1->id,
            'service_id' => $barba->id,
            'start_time' => Carbon::yesterday()->setHour(16),
            'end_time' => Carbon::yesterday()->setHour(16)->addMinutes(20),
            'status' => 'completed',
        ]);
    }
}