<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ScheduleConfigController;
use App\Http\Controllers\DateOverrideController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ProviderController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth:sanctum', 'role:provider'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('services', ServiceController::class)->except(['show']);

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

    Route::get('/providers', [ProviderController::class, 'index']);

    Route::get('/providers/{slug}', [ProviderController::class, 'show']);

    Route::get('/services/{id}', [ServiceController::class, 'show']);

    Route::get('/services/{id}/availability', [ServiceController::class, 'availability']);

    Route::get('/appointments', [AppointmentController::class, 'index']);

    Route::post('/appointments', [AppointmentController::class, 'store']);

    Route::get('/client/appointments', [AppointmentController::class, 'clientIndex']);

    Route::patch('/appointments/{id}/cancel', [AppointmentController::class, 'cancel']);
});