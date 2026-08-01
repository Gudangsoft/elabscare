<?php
// filepath: database/seeders/HealthRecordSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HealthRecord;
use App\Models\User;
use Carbon\Carbon;
use Faker\Factory as Faker;

class HealthRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $user = User::first();

        if (!$user) {
            $this->command->error('No user found! Please create a user first.');
            return;
        }

        // Clear existing records for this user
        HealthRecord::where('user_id', $user->id)->delete();

        // Generate data for the last 6 months
        $startDate = Carbon::now()->subMonths(6);
        $endDate = Carbon::now();

        // Define health patterns (simulating a health journey)
        $patterns = [
            // Phase 1: Poor health (6 months ago - 4 months ago)
            [
                'period' => [$startDate, $startDate->copy()->addMonths(2)],
                'sugar_fasting_range' => [110, 140],
                'sugar_after_meal_range' => [160, 200],
                'sugar_random_range' => [140, 180],
                'cholesterol_range' => [220, 280],
                'triglycerides_range' => [180, 250],
                'hdl_range' => [35, 45],
                'ldl_range' => [140, 180],
                'uric_acid_range' => $user->gender === 'male' ? [7.5, 9.0] : [6.5, 8.0],
                'frequency' => 0.6, // 60% chance of recording per week
            ],
            // Phase 2: Improving health (4 months ago - 2 months ago)
            [
                'period' => [$startDate->copy()->addMonths(2), $startDate->copy()->addMonths(4)],
                'sugar_fasting_range' => [95, 125],
                'sugar_after_meal_range' => [130, 170],
                'sugar_random_range' => [120, 160],
                'cholesterol_range' => [200, 240],
                'triglycerides_range' => [150, 200],
                'hdl_range' => [40, 55],
                'ldl_range' => [120, 160],
                'uric_acid_range' => $user->gender === 'male' ? [6.5, 8.0] : [5.5, 7.0],
                'frequency' => 0.8, // 80% chance of recording per week
            ],
            // Phase 3: Good health (2 months ago - now)
            [
                'period' => [$startDate->copy()->addMonths(4), $endDate],
                'sugar_fasting_range' => [80, 105],
                'sugar_after_meal_range' => [110, 140],
                'sugar_random_range' => [100, 130],
                'cholesterol_range' => [160, 200],
                'triglycerides_range' => [100, 150],
                'hdl_range' => [50, 70],
                'ldl_range' => [90, 130],
                'uric_acid_range' => $user->gender === 'male' ? [5.0, 7.0] : [4.0, 6.0],
                'frequency' => 0.9, // 90% chance of recording per week
            ]
        ];

        $recordCount = 0;

        foreach ($patterns as $pattern) {
            $phaseStart = $pattern['period'][0];
            $phaseEnd = $pattern['period'][1];
            
            // Generate records for this phase
            $currentDate = $phaseStart->copy();
            
            while ($currentDate <= $phaseEnd) {
                // Check if we should record this week (based on frequency)
                if ($faker->randomFloat(2, 0, 1) <= $pattern['frequency']) {
                    
                    // Sometimes record multiple times in a week (follow-up checks)
                    $recordsThisWeek = $faker->randomElement([1, 1, 1, 2]); // Mostly 1, sometimes 2
                    
                    for ($i = 0; $i < $recordsThisWeek; $i++) {
                        $recordDate = $currentDate->copy()->addDays($faker->numberBetween(0, 6));
                        
                        // Add some randomness to make it realistic
                        $stressLevel = $faker->randomFloat(2, 0.8, 1.2); // 80% to 120% of base values
                        
                        // Generate lab values with some correlation
                        $sugarFasting = $faker->numberBetween(
                            $pattern['sugar_fasting_range'][0], 
                            $pattern['sugar_fasting_range'][1]
                        ) * $stressLevel;
                        
                        $sugarAfterMeal = $sugarFasting + $faker->numberBetween(20, 50);
                        $sugarRandom = $faker->numberBetween(
                            min($sugarFasting, $sugarAfterMeal) - 10,
                            max($sugarFasting, $sugarAfterMeal) + 10
                        );

                        // Sometimes don't record all parameters (realistic scenario)
                        $hasFullPanel = $faker->randomFloat(2, 0, 1) <= 0.7; // 70% chance of full panel
                        
                        HealthRecord::create([
                            'user_id' => $user->id,
                            'sugar_fasting' => round($sugarFasting, 1),
                            'sugar_after_meal' => $hasFullPanel ? round($sugarAfterMeal, 1) : null,
                            'sugar_random' => $faker->boolean(30) ? round($sugarRandom, 1) : null, // 30% chance
                            'cholesterol_total' => $hasFullPanel ? $faker->numberBetween(
                                $pattern['cholesterol_range'][0], 
                                $pattern['cholesterol_range'][1]
                            ) : null,
                            'triglycerides' => $hasFullPanel ? $faker->numberBetween(
                                $pattern['triglycerides_range'][0], 
                                $pattern['triglycerides_range'][1]
                            ) : null,
                            'hdl' => $hasFullPanel ? $faker->numberBetween(
                                $pattern['hdl_range'][0], 
                                $pattern['hdl_range'][1]
                            ) : null,
                            'ldl' => $hasFullPanel ? $faker->numberBetween(
                                $pattern['ldl_range'][0], 
                                $pattern['ldl_range'][1]
                            ) : null,
                            'uric_acid' => $faker->boolean(80) ? $faker->randomFloat(1, // 80% chance
                                $pattern['uric_acid_range'][0], 
                                $pattern['uric_acid_range'][1]
                            ) : null,
                            'recorded_at' => $recordDate->format('Y-m-d H:i:s'),
                        ]);
                        
                        $recordCount++;
                    }
                }
                
                $currentDate->addWeek();
            }
        }

        // Add some recent records with good values to show current status
        $recentDates = [
            Carbon::now()->subDays(3),
            Carbon::now()->subDays(7),
            Carbon::now()->subDays(14),
            Carbon::now()->subDays(21),
        ];

        foreach ($recentDates as $date) {
            HealthRecord::create([
                'user_id' => $user->id,
                'sugar_fasting' => $faker->numberBetween(85, 95),
                'sugar_after_meal' => $faker->numberBetween(115, 135),
                'sugar_random' => $faker->numberBetween(100, 120),
                'cholesterol_total' => $faker->numberBetween(170, 190),
                'triglycerides' => $faker->numberBetween(110, 140),
                'hdl' => $faker->numberBetween(55, 65),
                'ldl' => $faker->numberBetween(100, 120),
                'uric_acid' => $faker->randomFloat(1, 
                    $user->gender === 'male' ? 5.5 : 4.5, 
                    $user->gender === 'male' ? 6.5 : 5.5
                ),
                'recorded_at' => $date->format('Y-m-d H:i:s'),
            ]);
            
            $recordCount++;
        }

        // Add some special event records (like annual checkup)
        $annualCheckup = Carbon::now()->subMonths(3);
        HealthRecord::create([
            'user_id' => $user->id,
            'sugar_fasting' => 92,
            'sugar_after_meal' => 128,
            'sugar_random' => 115,
            'cholesterol_total' => 185,
            'triglycerides' => 125,
            'hdl' => 58,
            'ldl' => 110,
            'uric_acid' => $user->gender === 'male' ? 6.2 : 5.1,
            'recorded_at' => $annualCheckup->format('Y-m-d H:i:s'),
        ]);
        
        $recordCount++;

        $this->command->info("Created {$recordCount} health records for user: {$user->name}");
        $this->command->info("Date range: {$startDate->format('Y-m-d')} to {$endDate->format('Y-m-d')}");
        $this->command->info("Health journey: Poor → Improving → Good (showing progress over time)");
    }
}