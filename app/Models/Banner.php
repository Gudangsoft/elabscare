<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Banner extends Model
{
    protected $fillable = [
        'image_path',
        'is_active',
    ];

    protected $appends = ['full_image_url'];

    public function getFullImageUrlAttribute(): string
    {
        return Storage::url($this->image_path);
    }
}
