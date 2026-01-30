<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedule_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
            $table->unsignedTinyInteger('day_of_week');

            $table->time('start_time');
            $table->time('end_time');

            // Permitimos nulo caso o profissional não faça pausa
            $table->time('lunch_start_time')->nullable();
            $table->time('lunch_end_time')->nullable();

            $table->timestamps();

            // Regra de Ouro: Um usuário não pode ter dois horários para o mesmo dia
            $table->unique(['user_id', 'day_of_week']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule');
    }
};
