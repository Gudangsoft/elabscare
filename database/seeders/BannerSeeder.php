<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Banner;

class BannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banners = [
            [
                'image_path' => 'banners/6Fb2ZNqOMWMzOf2eGRz0fYw4uxeW3PM6whwkpJWZ.png',
                'is_active' => true,
            ],
            [
                'image_path' => 'banners/j3dvBI5oftFCCbvXnlx2slY7mpQLr7yRQO1y53rB.png',
                'is_active' => true,
            ],
            [
                'image_path' => 'banners/Oe4PSXkbS1BNvo74N7hMNB4IcdooTSozpUdvyM9K.png',
                'is_active' => true,
            ]
        ];

        foreach ($banners as $banner) {
            Banner::create($banner);
        }
    }
}
