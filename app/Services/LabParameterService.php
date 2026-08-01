<?php
namespace App\Services;

use App\Models\LabParameter;
use App\Models\HealthRecord;
use Illuminate\Support\Collection;

class LabParameterService
{
    // Mapping dari health record field ke parameter codes
    private $fieldToParameterMap = [
        'sugar_fasting' => 'sugar_fasting',
        'sugar_after_meal' => 'sugar_after_meal', 
        'sugar_random' => 'sugar_random',
        'cholesterol_total' => 'cholesterol_total',
        'triglycerides' => 'triglycerides',
        'hdl' => ['hdl_male', 'hdl_female'], // Array karena ada 2 parameter
        'ldl' => 'ldl',
        'uric_acid' => ['uric_acid_male', 'uric_acid_female'] // Array karena ada 2 parameter
    ];

    public function getParametersByCategory(): Collection
    {
        return LabParameter::active()
            ->ordered()
            ->get()
            ->groupBy('category');
    }

    public function getParameterForField($fieldName, $gender = null): ?LabParameter
    {
        $parameterCodes = $this->fieldToParameterMap[$fieldName] ?? null;
        
        if (!$parameterCodes) return null;

        // Jika parameter code adalah array (gender specific)
        if (is_array($parameterCodes)) {
            foreach ($parameterCodes as $code) {
                $parameter = LabParameter::where('parameter_code', $code)->active()->first();
                if ($parameter && ($parameter->gender === $gender || $parameter->gender === 'all')) {
                    return $parameter;
                }
            }
            // Fallback ke gender 'all' jika ada
            foreach ($parameterCodes as $code) {
                $parameter = LabParameter::where('parameter_code', $code)
                    ->where('gender', 'all')
                    ->active()
                    ->first();
                if ($parameter) return $parameter;
            }
        } else {
            // Single parameter code
            return LabParameter::where('parameter_code', $parameterCodes)
                ->active()
                ->first();
        }

        return null;
    }

    public function analyzeHealthRecord(HealthRecord $healthRecord, $userGender = null): array
    {
        $categories = $this->getParametersByCategory();
        $analysis = [];

        foreach ($categories as $categoryName => $parameters) {
            $categoryTests = [];
            
            foreach ($parameters as $parameter) {
                // Find corresponding field in health record
                $fieldName = $this->getFieldNameFromParameter($parameter->parameter_code);
                if (!$fieldName) continue;

                $value = $healthRecord->{$fieldName};
                
                // Skip jika gender tidak sesuai
                if ($parameter->gender !== 'all' && $userGender && $parameter->gender !== $userGender) {
                    continue;
                }
                
                $status = $parameter->getValueStatus($value, $userGender);
                
                $categoryTests[] = [
                    'parameter' => $parameter,
                    'value' => $value,
                    'status' => $status,
                    'has_value' => !is_null($value) && $value > 0
                ];
            }
            
            if (!empty($categoryTests)) {
                $analysis[$categoryName] = $categoryTests;
            }
        }

        return $analysis;
    }

    private function getFieldNameFromParameter($parameterCode): ?string
    {
        $map = [
            'sugar_fasting' => 'sugar_fasting',
            'sugar_after_meal' => 'sugar_after_meal',
            'sugar_random' => 'sugar_random',
            'cholesterol_total' => 'cholesterol_total',
            'triglycerides' => 'triglycerides',
            'hdl_male' => 'hdl',
            'hdl_female' => 'hdl',
            'ldl' => 'ldl',
            'uric_acid_male' => 'uric_acid',
            'uric_acid_female' => 'uric_acid'
        ];

        return $map[$parameterCode] ?? null;
    }

    public function getOverallStatus(HealthRecord $healthRecord, $userGender = null): array
    {
        $analysis = $this->analyzeHealthRecord($healthRecord, $userGender);
        $abnormalCount = 0;
        $totalWithValues = 0;

        foreach ($analysis as $category => $tests) {
            foreach ($tests as $test) {
                if ($test['has_value']) {
                    $totalWithValues++;
                    if ($test['status']['status'] !== 'Normal' && $test['status']['status'] !== '-') {
                        $abnormalCount++;
                    }
                }
            }
        }

        if ($totalWithValues === 0) {
            return [
                'status' => 'Tidak Ada Data',
                'color' => 'text-gray-700',
                'bgColor' => 'bg-gray-100'
            ];
        }

        if ($abnormalCount === 0) {
            return [
                'status' => 'Semua Normal',
                'color' => 'text-green-700',
                'bgColor' => 'bg-green-100'
            ];
        } else {
            return [
                'status' => 'Perlu Perhatian',
                'color' => 'text-yellow-700',
                'bgColor' => 'bg-yellow-100'
            ];
        }
    }
}