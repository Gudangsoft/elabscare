<?php

namespace Database\Seeders;

use App\Models\AppLogo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class AppLogoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $logoContent = file_get_contents(public_path('images/logo.png'));

        $path = 'app_logo/logo.png';
        Storage::disk('public')->put($path, $logoContent);

        AppLogo::create([
            'logo_path' => $path
        ]);
    }
}
