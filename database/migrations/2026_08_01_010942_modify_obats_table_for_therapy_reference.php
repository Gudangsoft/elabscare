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
        Schema::table('obats', function (Blueprint $table) {
            $table->dropUnique(['kode_obat']);
            $table->dropColumn(['kode_obat', 'kategori', 'satuan', 'harga', 'stok', 'deskripsi']);
            $table->foreignId('obat_golongan_id')->after('id')->constrained('obat_golongans')->cascadeOnDelete();
            $table->string('sub_golongan')->nullable()->after('obat_golongan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('obats', function (Blueprint $table) {
            $table->dropForeign(['obat_golongan_id']);
            $table->dropColumn(['obat_golongan_id', 'sub_golongan']);
            $table->string('kode_obat')->unique()->after('id');
            $table->string('kategori')->nullable();
            $table->string('satuan')->nullable();
            $table->decimal('harga', 12, 2)->default(0);
            $table->integer('stok')->default(0);
            $table->text('deskripsi')->nullable();
        });
    }
};
