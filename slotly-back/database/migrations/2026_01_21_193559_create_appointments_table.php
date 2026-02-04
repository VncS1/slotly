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

            $table->foreignId('provider_id')->constrained('users')->onDelete('cascade');

            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');

            $table->foreignId('service_id')->constrained()->onDelete('cascade');

            $table->dateTime('start_time');
            $table->dateTime('end_time');

            $table->enum('status', ['active', 'pending', 'canceled', 'completed'])->default('pending');

            $table->text('notes')->nullable();

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
