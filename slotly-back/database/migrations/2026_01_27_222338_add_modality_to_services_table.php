<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('services', function (Blueprint $table) {
            // Adiciona a coluna 'modality' aceitando apenas os dois valores
            // O default 'online' garante que não quebre registros antigos se houver
            $table->enum('modality', ['online', 'in_person'])->default('online');
        });
    }

    public function down()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('modality');
        });
    }
};
