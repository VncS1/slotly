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
        'business_name',
        'business_slug',
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

    public function categories(){
        return $this->belongsToMany(Category::class);
    }
}