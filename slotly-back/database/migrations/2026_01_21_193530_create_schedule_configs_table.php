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

            // 0 = Domingo, 1 = Segunda... 6 = Sábado
            $table->tinyInteger('day_of_week');

            $table->time('start_time'); // Ex: 09:00
            $table->time('end_time');   // Ex: 18:00
            $table->time('lunch_start_time')->nullable(); // Pausa almoço
            $table->time('lunch_end_time')->nullable();

            $table->timestamps();

            // Evita duplicidade: O prestador não pode ter duas configs pro mesmo dia da semana
            $table->unique(['user_id', 'day_of_week']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_configs');
    }
};
