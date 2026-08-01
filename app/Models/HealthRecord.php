<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class HealthRecord extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'sugar_fasting',
        'sugar_after_meal',
        'sugar_random',
        'cholesterol_total',
        'triglycerides',
        'hdl',
        'ldl',
        'uric_acid',
        'recorded_at',
        'type_document',
        'lab_document',
        
    ];
    protected $casts = [
        'recorded_at' => 'date',
        'sugar_fasting' => 'decimal:2',
        'sugar_after_meal' => 'decimal:2',
        'sugar_random' => 'decimal:2',
        'cholesterol_total' => 'decimal:2',
        'triglycerides' => 'decimal:2',
        'hdl' => 'decimal:2',
        'ldl' => 'decimal:2',
        'uric_acid' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
