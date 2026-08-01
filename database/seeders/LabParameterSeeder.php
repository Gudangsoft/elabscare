<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LabParameter;

class LabParameterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $parameters = [
            // Gula Darah
            [
                'parameter_code' => 'sugar_fasting',
                'parameter_name' => 'Gula Darah Puasa (GDP)',
                'category' => 'Gula Darah',
                'unit' => 'mg/dL',
                'normal_min' => 70,
                'normal_max' => 100,
                'normal_range_text' => '70-100',
                'gender' => 'all',
                'description' => 'Kadar gula darah setelah puasa 8-12 jam',
                'sort_order' => 1
            ],
            [
                'parameter_code' => 'sugar_after_meal',
                'parameter_name' => 'Gula Darah 2 Jam PP (GD2PP)',
                'category' => 'Gula Darah',
                'unit' => 'mg/dL',
                'normal_min' => 0,
                'normal_max' => 140,
                'normal_range_text' => '< 140',
                'gender' => 'all',
                'description' => 'Kadar gula darah 2 jam setelah makan',
                'sort_order' => 2
            ],
            [
                'parameter_code' => 'sugar_random',
                'parameter_name' => 'Gula Darah Sewaktu (GDS)',
                'category' => 'Gula Darah',
                'unit' => 'mg/dL',
                'normal_min' => 0,
                'normal_max' => 140,
                'normal_range_text' => '< 140',
                'gender' => 'all',
                'description' => 'Kadar gula darah sewaktu tanpa memperhatikan waktu makan',
                'sort_order' => 3
            ],

            // Kolesterol
            [
                'parameter_code' => 'cholesterol_total',
                'parameter_name' => 'Kolesterol Total',
                'category' => 'Kolesterol',
                'unit' => 'mg/dL',
                'normal_min' => 0,
                'normal_max' => 200,
                'normal_range_text' => '< 200',
                'gender' => 'all',
                'description' => 'Total kolesterol dalam darah',
                'sort_order' => 4
            ],
            [
                'parameter_code' => 'triglycerides',
                'parameter_name' => 'Trigliserida (TG)',
                'category' => 'Kolesterol',
                'unit' => 'mg/dL',
                'normal_min' => 0,
                'normal_max' => 150,
                'normal_range_text' => '< 150',
                'gender' => 'all',
                'description' => 'Kadar trigliserida dalam darah',
                'sort_order' => 5
            ],
            [
                'parameter_code' => 'hdl_male',
                'parameter_name' => 'HDL Kolesterol',
                'category' => 'Kolesterol',
                'unit' => 'mg/dL',
                'normal_min' => 40,
                'normal_max' => 999,
                'normal_range_text' => '> 40 (P)',
                'gender' => 'male',
                'description' => 'HDL kolesterol untuk pria',
                'sort_order' => 6
            ],
            [
                'parameter_code' => 'hdl_female',
                'parameter_name' => 'HDL Kolesterol',
                'category' => 'Kolesterol',
                'unit' => 'mg/dL',
                'normal_min' => 50,
                'normal_max' => 999,
                'normal_range_text' => '> 50 (W)',
                'gender' => 'female',
                'description' => 'HDL kolesterol untuk wanita',
                'sort_order' => 6
            ],
            [
                'parameter_code' => 'ldl',
                'parameter_name' => 'LDL Kolesterol',
                'category' => 'Kolesterol',
                'unit' => 'mg/dL',
                'normal_min' => 0,
                'normal_max' => 100,
                'normal_range_text' => '< 100',
                'gender' => 'all',
                'description' => 'LDL kolesterol (kolesterol jahat)',
                'sort_order' => 7
            ],

            // Asam Urat
            [
                'parameter_code' => 'uric_acid_male',
                'parameter_name' => 'Asam Urat',
                'category' => 'Asam Urat',
                'unit' => 'mg/dL',
                'normal_min' => 0,
                'normal_max' => 7,
                'normal_range_text' => '< 7 (P)',
                'gender' => 'male',
                'description' => 'Kadar asam urat untuk pria',
                'sort_order' => 8
            ],
            [
                'parameter_code' => 'uric_acid_female',
                'parameter_name' => 'Asam Urat',
                'category' => 'Asam Urat',
                'unit' => 'mg/dL',
                'normal_min' => 0,
                'normal_max' => 6,
                'normal_range_text' => '< 6 (W)',
                'gender' => 'female',
                'description' => 'Kadar asam urat untuk wanita',
                'sort_order' => 8
            ],
        ];

        foreach ($parameters as $parameter) {
            LabParameter::create($parameter);
        }
    }
}
