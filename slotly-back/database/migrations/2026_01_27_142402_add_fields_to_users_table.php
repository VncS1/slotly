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
        Schema::table('users', function (Blueprint $table) {
            // Nullable porque o Cliente comum NÃO vai ter business_name
            $table->string('business_name')->nullable()->after('email');

            // Vamos deixar preparado para o Wizard (passo 3 das imagens)
            $table->string('business_slug')->nullable()->unique()->after('business_name'); // Para a URL (saas.com/barbearia-do-ze)
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['business_name', 'business_slug']);
        });
    }
};
