<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'User Test Male',
            'email' => 'user.male@gmail.com',
            'whatsapp_number' => '+6281234567890',
            'birth_place' => 'Jakarta',
            'birth_date' => '1990-01-01',
            'address' => 'Jl. Jend. Sudirman No. 123, Kota Mat, Jakarta',
            'gender' => 'male',
            'role' => 'user',
            'password' => bcrypt('Password123'),
        ]);

        User::factory()->create([
            'name' => 'User Test Female',
            'email' => 'user.female@gmail.com',
            'whatsapp_number' => '+6281234567892',
            'birth_place' => 'Jakarta',
            'birth_date' => '1990-01-01',
            'address' => 'Jl. H. Nawi No. 123, Kota Mat, Jakarta',
            'gender' => 'female',
            'role' => 'user',
            'password' => bcrypt('Password123'),
        ]);

        User::factory()->create([
            'name' => 'Admin Test',
            'email' => 'admin@gmail.com',
            'whatsapp_number' => '+6281234567891',
            'birth_place' => 'Jakarta',
            'birth_date' => '1990-01-01',
            'address' => 'Jl. Jend. Sudirman No. 123, Kota Mat, Jakarta',
            'gender' => 'male',
            'role' => 'admin',
            'avatar' => 'avatars/9bb77397-fce5-40c6-bec6-0177f71681b4.jpg',
            'password' => bcrypt('Password123'),
        ]);
    }
}
