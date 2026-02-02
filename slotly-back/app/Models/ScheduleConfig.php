<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'day_of_week',
        'start_time',
        'end_time',
        'lunch_start_time',
        'lunch_end_time',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'lunch_start_time' => 'datetime:H:i',
        'lunch_end_time' => 'datetime:H:i',
    ];

    public function provider()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}