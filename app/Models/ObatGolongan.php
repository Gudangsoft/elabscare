<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ObatGolongan extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
    ];

    public function obat(): HasMany
    {
        return $this->hasMany(Obat::class);
    }
}
