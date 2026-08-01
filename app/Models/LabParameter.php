<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabParameter extends Model
{
    use HasFactory;

    protected $fillable = [
        'parameter_code',
        'parameter_name',
        'category',
        'unit',
        'normal_min',
        'normal_max',
        'normal_range_text',
        'gender',
        'description',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'normal_min' => 'decimal:2',
        'normal_max' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('parameter_name');
    }

    // Method untuk cek status nilai
    public function getValueStatus($value, $gender = null)
    {
        if (!$value) {
            return ['status' => '-', 'color' => 'text-gray-400', 'bgColor' => 'bg-gray-100'];
        }

        // Jika parameter specific untuk gender, cek gender
        if ($this->gender && $this->gender !== 'all' && $gender && $this->gender !== $gender) {
            // Jika ada parameter dengan gender yang sesuai, gunakan itu
            $genderSpecific = self::where('parameter_code', $this->parameter_code)
                ->where('gender', $gender)
                ->first();
            if ($genderSpecific) {
                return $genderSpecific->getValueStatus($value, $gender);
            }
        }

        if ($value < $this->normal_min) {
            return ['status' => 'Rendah', 'color' => 'text-blue-700', 'bgColor' => 'bg-blue-100'];
        } elseif ($value > $this->normal_max) {
            return ['status' => 'Tinggi', 'color' => 'text-red-700', 'bgColor' => 'bg-red-100'];
        } else {
            return ['status' => 'Normal', 'color' => 'text-green-700', 'bgColor' => 'bg-green-100'];
        }
    }
}
