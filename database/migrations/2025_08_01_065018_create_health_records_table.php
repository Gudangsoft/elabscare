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
        Schema::create('health_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('sugar_fasting', 5, 2)->nullable();
            $table->decimal('sugar_after_meal', 5, 2)->nullable();
            $table->decimal('sugar_random', 5, 2)->nullable();
            $table->decimal('cholesterol_total', 5, 2)->nullable();
            $table->decimal('triglycerides', 5, 2)->nullable();
            $table->decimal('hdl', 5, 2)->nullable();
            $table->decimal('ldl', 5, 2)->nullable();
            $table->decimal('uric_acid', 5, 2)->nullable();
            $table->date('recorded_at');
            $table->string('type_document')->nullable();
            $table->string('lab_document')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_records');
    }
};
