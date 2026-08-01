<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ObatDosis extends Model
{
    use HasFactory;

    protected $table = 'obat_dosis';

    protected $fillable = [
        'obat_id',
        'dosis',
        'sort_order',
    ];

    public function obat(): BelongsTo
    {
        return $this->belongsTo(Obat::class);
    }
}
