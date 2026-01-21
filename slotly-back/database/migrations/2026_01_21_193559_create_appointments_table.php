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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            // Quem está oferecendo o serviço
            $table->foreignId('provider_id')->constrained('users')->onDelete('cascade');

            // Quem está agendando (pode ser null se for agendamento manual do admin, mas vamos focar no app)
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');

            // Qual serviço
            $table->foreignId('service_id')->constrained()->onDelete('cascade');

            $table->dateTime('start_time'); // Data e Hora do início
            $table->dateTime('end_time');   // Data e Hora do fim (calculado via duração)

            $table->enum('status', ['pending', 'confirmed', 'canceled', 'completed'])->default('pending');

            $table->text('notes')->nullable(); // Observações do cliente

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
