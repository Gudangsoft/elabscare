<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            LabParameterSeeder::class,
            HealthRecordSeeder::class,
            NotificationSeeder::class,
            BannerSeeder::class,
            AppLogoSeeder::class,
            SettingSeeder::class,
            ObatSeeder::class,
        ]);
    }
}
