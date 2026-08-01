<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lab_parameters', function (Blueprint $table) {
            $table->id();
            $table->string('parameter_code')->unique(); // e.g., 'sugar_fasting', 'cholesterol_total'
            $table->string('parameter_name'); // e.g., 'Gula Darah Puasa (GDP)'
            $table->string('category'); // e.g., 'Gula Darah', 'Kolesterol'
            $table->string('unit'); // e.g., 'mg/dL'
            $table->decimal('normal_min', 8, 2)->nullable();
            $table->decimal('normal_max', 8, 2)->nullable();
            $table->string('normal_range_text'); // e.g., '70-100', '< 200'
            $table->string('gender')->nullable(); // 'male', 'female', 'all'
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lab_parameters');
    }
};
