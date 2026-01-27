<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text(column: 'bio')->nullable()->after('phone');
            $table->string('profile_photo_path', 2048)->nullable()->after('bio');

        });
    }


    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(columns: ['bio', 'profile_photo_path']);

        });
    }
};
