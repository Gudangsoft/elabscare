<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        Notification::create([
            'user_id' => $user->id,
            'title' => 'Pengingat Pemeriksaan Rutin',
            'message' => 'Jangan lupa melakukan pemeriksaan rutin minggu ini!',
            'is_read' => false,
            'scheduled_at' => now()->addDays(3),
        ]);
    }
}
