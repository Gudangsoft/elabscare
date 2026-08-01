<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Obat extends Model
{
    use HasFactory;

    protected $fillable = [
        'obat_golongan_id',
        'sub_golongan',
        'nama_obat',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function golongan(): BelongsTo
    {
        return $this->belongsTo(ObatGolongan::class, 'obat_golongan_id');
    }

    public function dosis(): HasMany
    {
        return $this->hasMany(ObatDosis::class)->orderBy('sort_order');
    }

    public function frekuensi(): HasMany
    {
        return $this->hasMany(ObatFrekuensi::class)->orderBy('sort_order');
    }

    public function terapiObat(): HasMany
    {
        return $this->hasMany(TerapiObat::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
