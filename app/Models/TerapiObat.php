<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TerapiObat extends Model
{
    use HasFactory;

    public const STATUS_AKTIF = 'aktif';
    public const STATUS_DOSIS_DIUBAH = 'dosis_diubah';
    public const STATUS_DIHENTIKAN = 'dihentikan';

    protected $fillable = [
        'user_id',
        'obat_id',
        'dosis',
        'frekuensi',
        'status',
        'tanggal_mulai',
        'tanggal_selesai',
        'catatan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function obat(): BelongsTo
    {
        return $this->belongsTo(Obat::class);
    }
}
