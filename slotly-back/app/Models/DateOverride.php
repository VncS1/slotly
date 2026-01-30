<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DateOverride extends Model
{
    use HasFactory;

    // No User.php
    public function dateOverrides()
    {
        return $this->hasMany(DateOverride::class);
    }

    // No DateOverride.php
    protected $fillable = ['user_id', 'title', 'date', 'is_closed', 'start_time', 'end_time'];
}