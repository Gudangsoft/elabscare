<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HealthRecord;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Banner;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        // dd($user->toArray());
        $selectedDate = $request->get('date', now()->format('Y-m-d'));

        // Get health record for selected date or latest
        $healthRecord = $this->getHealthRecordForDate($selectedDate);

        // Get summary statistics
        $healthSummary = $this->getHealthSummary($selectedDate);

        // Get trend data (last 7 days from selected date)
        $trendData = $this->getTrendData($selectedDate);

        // Get banner image
        $banners = Banner::where('is_active', true)->get();

        return Inertia::render('home/home', [
            'user' => $user,
            'selectedDate' => $selectedDate,
            'healthRecord' => $healthRecord,
            'healthSummary' => $healthSummary,
            'trendData' => $trendData,
            'banners' => $banners,
        ]);
    }

    private function getHealthRecordForDate($selectedDate)
    {
        $userId = Auth::id();

        // Try to get record for exact date first
        $record = HealthRecord::where('user_id', $userId)
            ->whereDate('recorded_at', $selectedDate)
            ->latest('recorded_at')
            ->first();

        // If no record for selected date, get the latest record before that date
        if (!$record) {
            $record = HealthRecord::where('user_id', $userId)
                ->whereDate('recorded_at', '<=', $selectedDate)
                ->latest('recorded_at')
                ->first();
        }

        // If still no record, get the latest record overall
        if (!$record) {
            $record = HealthRecord::where('user_id', $userId)
                ->latest('recorded_at')
                ->first();
        }

        return $record;
    }

    private function getHealthSummary($selectedDate)
    {
        $userId = Auth::id();
        $startDate = Carbon::parse($selectedDate)->startOfMonth();
        $endDate = Carbon::parse($selectedDate)->endOfMonth();

        $records = HealthRecord::where('user_id', $userId)
            ->whereBetween('recorded_at', [$startDate, $endDate])
            ->get();

        if ($records->isEmpty()) {
            return [
                'total_records' => 0,
                'normal_count' => 0,
                'abnormal_count' => 0,
                'last_check' => null
            ];
        }

        $abnormalCount = 0;
        foreach ($records as $record) {
            $hasAbnormal =
                ($record->sugar_fasting && $record->sugar_fasting > 100) ||
                ($record->sugar_after_meal && $record->sugar_after_meal > 140) ||
                ($record->cholesterol_total && $record->cholesterol_total > 200) ||
                ($record->uric_acid && $record->uric_acid > 7);

            if ($hasAbnormal) {
                $abnormalCount++;
            }
        }

        return [
            'total_records' => $records->count(),
            'normal_count' => $records->count() - $abnormalCount,
            'abnormal_count' => $abnormalCount,
            'last_check' => $records->first()->recorded_at ?? null
        ];
    }

    private function getTrendData($selectedDate)
    {
        $userId = Auth::id();
        $endDate = Carbon::parse($selectedDate);
        $startDate = $endDate->copy()->subDays(6); // 7 days total

        $records = HealthRecord::where('user_id', $userId)
            ->whereBetween('recorded_at', [$startDate, $endDate])
            ->orderBy('recorded_at')
            ->get()
            ->groupBy(function($record) {
                return Carbon::parse($record->recorded_at)->format('Y-m-d');
            });

        $trendData = [];
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateStr = $date->format('Y-m-d');
            $dayRecords = $records->get($dateStr, collect());

            $avgSugar = $dayRecords->avg('sugar_fasting') ?: 0;
            $avgCholesterol = $dayRecords->avg('cholesterol_total') ?: 0;
            $avgUricAcid = $dayRecords->avg('uric_acid') ?: 0;

            $trendData[] = [
                'date' => $dateStr,
                'sugar_fasting' => round($avgSugar, 1),
                'cholesterol_total' => round($avgCholesterol, 1),
                'uric_acid' => round($avgUricAcid, 1),
                'day' => $date->format('D')
            ];
        }

        return $trendData;
    }
}
