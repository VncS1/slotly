<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ScheduleConfigController;
use App\Http\Controllers\DateOverrideController;
use App\Http\Controllers\AppointmentController; 

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth:sanctum', 'role:provider'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('services', ServiceController::class);
    
    Route::put('/user/setup-slug', [AuthController::class, 'updateSlug']);

    Route::post('/user/profile-update', [AuthController::class, 'updateProfile']);

    Route::get('/schedule-configs', [ScheduleConfigController::class, 'index']);

    Route::post('/schedule-configs', [ScheduleConfigController::class, 'store']);

    Route::apiResource('date-overrides', DateOverrideController::class)->only(['index', 'store', 'destroy']);

    Route::get('/appointments', [AppointmentController::class, 'index']);

    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
});

Route::middleware(['auth:sanctum', 'role:client'])->group(function () {
    Route::post('/');
});