<?php
// filepath: app/Http/Controllers/TrendController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HealthRecord;
use App\Models\TerapiObat;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class TrendController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $period = $request->get('period', '3M');

        $trendData = $this->getTrendData($period);
        $summaryStats = $this->getSummaryStats($period);
        $insights = $this->getHealthInsights($trendData);
        $gaugeData = $this->getGaugeData();
        $heatmapData = $this->getHeatmapData($period);
        [$medicationPeriods, $periodRange] = $this->getMedicationPeriods($period);

        // dd($gaugeData);

        // dd($user, $trendData, $summaryStats, $insights, $period, $gaugeData, $heatmapData);

        return Inertia::render('trends/trend', [
            'user' => $user,
            'trendData' => $trendData,
            'summaryStats' => $summaryStats,
            'insights' => $insights,
            'currentPeriod' => $period,
            'gaugeData' => $gaugeData,
            'heatmapData' => $heatmapData,
            'medicationPeriods' => $medicationPeriods,
            'periodRange' => $periodRange,
        ]);
    }

    private function getTrendData($period)
    {
        $userId = Auth::id();

        // Calculate date range based on period
        $endDate = now();
        $startDate = match ($period) {
            '1M' => $endDate->copy()->subMonth(),
            '3M' => $endDate->copy()->subMonths(3),
            '6M' => $endDate->copy()->subMonths(6),
            '1Y' => $endDate->copy()->subYear(),
            default => $endDate->copy()->subMonths(3)
        };

        $records = HealthRecord::where('user_id', $userId)
            ->whereBetween('recorded_at', [$startDate, $endDate])
            ->orderBy('recorded_at')
            ->get();

        // Group by date for better visualization
        $groupedData = $records->groupBy(function ($record) {
            return Carbon::parse($record->recorded_at)->format('Y-m-d');
        });

        $chartData = [];
        foreach ($groupedData as $date => $dayRecords) {
            // Get average if multiple records per day
            $avgRecord = [
                'date' => $date,
                'sugar_fasting' => round($dayRecords->avg('sugar_fasting') ?: 0, 1),
                'sugar_after_meal' => round($dayRecords->avg('sugar_after_meal') ?: 0, 1),
                'sugar_random' => round($dayRecords->avg('sugar_random') ?: 0, 1),
                'cholesterol_total' => round($dayRecords->avg('cholesterol_total') ?: 0, 1),
                'triglycerides' => round($dayRecords->avg('triglycerides') ?: 0, 1),
                'hdl' => round($dayRecords->avg('hdl') ?: 0, 1),
                'ldl' => round($dayRecords->avg('ldl') ?: 0, 1),
                'uric_acid' => round($dayRecords->avg('uric_acid') ?: 0, 1),
                'recorded_at' => $dayRecords->first()->recorded_at
            ];

            $chartData[] = $avgRecord;
        }

        return $chartData;
    }

    private function getSummaryStats($period)
    {
        $userId = Auth::id();

        $endDate = now();
        $startDate = match ($period) {
            '1M' => $endDate->copy()->subMonth(),
            '3M' => $endDate->copy()->subMonths(3),
            '6M' => $endDate->copy()->subMonths(6),
            '1Y' => $endDate->copy()->subYear(),
            default => $endDate->copy()->subMonths(3)
        };

        $records = HealthRecord::where('user_id', $userId)
            ->whereBetween('recorded_at', [$startDate, $endDate])
            ->get();

        if ($records->isEmpty()) {
            return [
                'total_checks' => 0,
                'avg_sugar_fasting' => 0,
                'avg_cholesterol' => 0,
                'avg_uric_acid' => 0,
                'trend_sugar' => 'stable',
                'trend_cholesterol' => 'stable',
                'trend_uric_acid' => 'stable'
            ];
        }

        // Calculate trends (comparing first half vs second half of period)
        $midPoint = $records->count() / 2;
        $firstHalf = $records->take($midPoint);
        $secondHalf = $records->skip($midPoint);

        return [
            'total_checks' => $records->count(),
            'avg_sugar_fasting' => round($records->avg('sugar_fasting') ?: 0, 1),
            'avg_cholesterol' => round($records->avg('cholesterol_total') ?: 0, 1),
            'avg_uric_acid' => round($records->avg('uric_acid') ?: 0, 1),
            'trend_sugar' => $this->calculateTrend($firstHalf->avg('sugar_fasting'), $secondHalf->avg('sugar_fasting')),
            'trend_cholesterol' => $this->calculateTrend($firstHalf->avg('cholesterol_total'), $secondHalf->avg('cholesterol_total')),
            'trend_uric_acid' => $this->calculateTrend($firstHalf->avg('uric_acid'), $secondHalf->avg('uric_acid'))
        ];
    }

    private function calculateTrend($firstValue, $secondValue)
    {
        if (!$firstValue || !$secondValue) return 'stable';

        $change = (($secondValue - $firstValue) / $firstValue) * 100;

        if ($change > 5) return 'increasing';
        if ($change < -5) return 'decreasing';
        return 'stable';
    }

    private function getHealthInsights($trendData)
    {
        if (empty($trendData)) {
            return [
                'message' => 'Belum ada data untuk analisis. Mulai tambahkan hasil pemeriksaan untuk melihat trend.',
                'type' => 'info'
            ];
        }

        $latest = end($trendData);
        $insights = [];

        // Sugar insights
        if ($latest['sugar_fasting'] > 0) {
            if ($latest['sugar_fasting'] > 100) {
                $insights[] = 'Gula darah puasa Anda di atas normal. Pertimbangkan konsultasi dengan dokter.';
            } else {
                $insights[] = 'Gula darah puasa Anda dalam rentang normal. Pertahankan!';
            }
        }

        // Cholesterol insights
        if ($latest['cholesterol_total'] > 0) {
            if ($latest['cholesterol_total'] > 200) {
                $insights[] = 'Kolesterol total Anda tinggi. Pertimbangkan pola makan yang lebih sehat.';
            } else {
                $insights[] = 'Kolesterol total Anda dalam batas normal. Bagus!';
            }
        }

        return [
            'message' => !empty($insights) ? implode(' ', $insights) : 'Terus pantau kesehatan Anda secara rutin.',
            'type' => 'success'
        ];
    }

    private function getGaugeData()
    {
        $userId = Auth::id();

        // Get latest record
        $latestRecord = HealthRecord::where('user_id', $userId)
            ->latest('recorded_at')
            ->first();

        if (!$latestRecord) {
            return [
                'health_score' => 0,
                'score_level' => 'Tidak Ada Data',
                'color' => '#94a3b8',
                'breakdown' => [], 
                'has_data' => false 
            ];
        }

        // Calculate health score (0-100)
        $scores = [];

        // Sugar fasting score (0-20 points)
        if ($latestRecord->sugar_fasting) {
            if ($latestRecord->sugar_fasting >= 70 && $latestRecord->sugar_fasting <= 100) {
                $scores['sugar'] = 20;
            } elseif ($latestRecord->sugar_fasting < 70 || $latestRecord->sugar_fasting <= 140) {
                $scores['sugar'] = 10;
            } else {
                $scores['sugar'] = 0;
            }
        }

        // Cholesterol score (0-20 points)
        if ($latestRecord->cholesterol_total) {
            if ($latestRecord->cholesterol_total <= 200) {
                $scores['cholesterol'] = 20;
            } elseif ($latestRecord->cholesterol_total <= 240) {
                $scores['cholesterol'] = 10;
            } else {
                $scores['cholesterol'] = 0;
            }
        }

        // Uric acid score (0-20 points)
        if ($latestRecord->uric_acid) {
            $normalMax = Auth::user()->gender === 'male' ? 7 : 6;
            if ($latestRecord->uric_acid <= $normalMax) {
                $scores['uric_acid'] = 20;
            } elseif ($latestRecord->uric_acid <= $normalMax + 2) {
                $scores['uric_acid'] = 10;
            } else {
                $scores['uric_acid'] = 0;
            }
        }

        // HDL score (0-20 points)
        if ($latestRecord->hdl) {
            $normalMin = Auth::user()->gender === 'male' ? 40 : 50;
            if ($latestRecord->hdl >= $normalMin) {
                $scores['hdl'] = 20;
            } else {
                $scores['hdl'] = 10;
            }
        }

        // LDL score (0-20 points)
        if ($latestRecord->ldl) {
            if ($latestRecord->ldl <= 100) {
                $scores['ldl'] = 20;
            } elseif ($latestRecord->ldl <= 130) {
                $scores['ldl'] = 10;
            } else {
                $scores['ldl'] = 0;
            }
        }

        $totalScore = array_sum($scores);
        $maxPossibleScore = count($scores) * 20;
        $healthScore = $maxPossibleScore > 0 ? round(($totalScore / $maxPossibleScore) * 100) : 0;

        // Determine level and color
        if ($healthScore >= 80) {
            $level = 'Excellent';
            $color = '#10b981';
        } elseif ($healthScore >= 60) {
            $level = 'Good';
            $color = '#3b82f6';
        } elseif ($healthScore >= 40) {
            $level = 'Fair';
            $color = '#f59e0b';
        } else {
            $level = 'Needs Attention';
            $color = '#ef4444';
        }

        return [
            'health_score' => $healthScore,
            'score_level' => $level,
            'color' => $color,
            'breakdown' => $scores
        ];
    }

    private function getHeatmapData($period)
    {
        $userId = Auth::id();

        $endDate = now();
        $startDate = match ($period) {
            '1M' => $endDate->copy()->subMonth(),
            '3M' => $endDate->copy()->subMonths(3),
            '6M' => $endDate->copy()->subMonths(6),
            '1Y' => $endDate->copy()->subYear(),
            default => $endDate->copy()->subMonths(3)
        };

        $records = HealthRecord::where('user_id', $userId)
            ->whereBetween('recorded_at', [$startDate, $endDate])
            ->get()
            ->groupBy(function ($record) {
                return Carbon::parse($record->recorded_at)->format('Y-m-d');
            });

        $heatmapData = [];

        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateStr = $date->format('Y-m-d');
            $dayRecords = $records->get($dateStr, collect());
            $recordIds = $dayRecords->pluck('id')->all();

            $intensity = 0;
            $status = 'empty';

            if ($dayRecords->isNotEmpty()) {
                // Calculate intensity based on number of abnormal values
                $abnormalCount = 0;
                $totalValues = 0;

                foreach ($dayRecords as $record) {
                    $values = [
                        $record->sugar_fasting > 100 ? 1 : 0,
                        $record->sugar_after_meal > 140 ? 1 : 0,
                        $record->cholesterol_total > 200 ? 1 : 0,
                        $record->uric_acid > (Auth::user()->gender === 'male' ? 7 : 6) ? 1 : 0
                    ];

                    $abnormalCount += array_sum($values);
                    $totalValues += count(array_filter([$record->sugar_fasting, $record->sugar_after_meal, $record->cholesterol_total, $record->uric_acid]));
                }

                if ($totalValues > 0) {
                    if ($abnormalCount === 0) {
                        $intensity = 1;
                        $status = 'normal';
                    } elseif ($abnormalCount <= $totalValues * 0.3) {
                        $intensity = 2;
                        $status = 'warning';
                    } else {
                        $intensity = 3;
                        $status = 'danger';
                    }
                } else {
                    $intensity = 1;
                    $status = 'checked';
                }
            }

            $heatmapData[] = [
                'date' => $dateStr,
                'intensity' => $intensity,
                'status' => $status,
                'count' => $dayRecords->count(),
                'record_ids' => $recordIds
            ];
        }

        return $heatmapData;
    }

    private function getMedicationPeriods($period)
    {
        $userId = Auth::id();

        $endDate = now();
        $startDate = match ($period) {
            '1M' => $endDate->copy()->subMonth(),
            '3M' => $endDate->copy()->subMonths(3),
            '6M' => $endDate->copy()->subMonths(6),
            '1Y' => $endDate->copy()->subYear(),
            default => $endDate->copy()->subMonths(3)
        };

        $medications = TerapiObat::where('user_id', $userId)
            ->with('obat')
            ->where('tanggal_mulai', '<=', $endDate)
            ->where(function ($query) use ($startDate) {
                $query->whereNull('tanggal_selesai')->orWhere('tanggal_selesai', '>=', $startDate);
            })
            ->orderBy('tanggal_mulai')
            ->get()
            ->map(function ($terapi) {
                return [
                    'id' => $terapi->id,
                    'nama_obat' => $terapi->obat->nama_obat,
                    'status' => $terapi->status,
                    'tanggal_mulai' => $terapi->tanggal_mulai->toDateString(),
                    'tanggal_selesai' => $terapi->tanggal_selesai?->toDateString(),
                ];
            })
            ->values();

        return [
            $medications,
            [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
            ],
        ];
    }
}
