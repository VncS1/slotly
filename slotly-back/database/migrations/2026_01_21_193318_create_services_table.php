<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            // Relacionamento: Serviço pertence a um Prestador (User)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('duration_minutes'); // Ex: 30, 60
            $table->decimal('price', 10, 2);     // Ex: 150.00
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
