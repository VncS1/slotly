<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Importante para API

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role', // 'provider' ou 'client'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relacionamentos

    // Um prestador tem muitos serviços
    public function services()
    {
        return $this->hasMany(Service::class);
    }

    // Um prestador tem configurações de horário
    public function scheduleConfigs()
    {
        return $this->hasMany(ScheduleConfig::class);
    }

    // Agendamentos onde ele é o PRESTADOR
    public function appointmentsAsProvider()
    {
        return $this->hasMany(Appointment::class, 'provider_id');
    }

    // Agendamentos onde ele é o CLIENTE
    public function appointmentsAsClient()
    {
        return $this->hasMany(Appointment::class, 'client_id');
    }
}