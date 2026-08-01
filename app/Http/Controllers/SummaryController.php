<?php

namespace App\Http\Controllers;

use App\Models\HealthRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SummaryController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        $period = $request->query('period', 'all');

        $userQuery = User::query();
        $healthRecordQuery = HealthRecord::query();

        $chartData = [
            'categories' => [],
            'series' => [],
        ];

        $days = 0;

        if ($period === 'last-week') {
            $days = 7;
            $startDate = now()->subDays($days)->startOfDay();
            $userQuery->where('created_at', '>=', $startDate);
            $healthRecordQuery->where('created_at', '>=', $startDate);
        } elseif ($period === 'last-month') {
            $days = 30;
            $startDate = now()->subDays($days)->startOfDay();
            $userQuery->where('created_at', '>=', $startDate);
            $healthRecordQuery->where('created_at', '>=', $startDate);
        }

        if ($period === 'all') {
            $months = 12;

            for ($i = $months - 1; $i >= 0; $i--) {
                $chartData['categories'][] = Carbon::now()->subMonths($i)->format('M Y');
            }

            $userCounts = $this->getMonthlyCounts(User::query(), $months);
            $healthRecordCounts = $this->getMonthlyCounts(HealthRecord::query(), $months);

            $chartData['series'] = [
                [
                    'name' => 'Total Pengguna Baru',
                    'data' => $userCounts,
                ],
                [
                    'name' => 'Input Rekam Medis',
                    'data' => $healthRecordCounts,
                ]
            ];
        } elseif ($days > 0) {
            for ($i = $days - 1; $i >= 0; $i--) {
                $chartData['categories'][] = Carbon::now()->subDays($i)->format('d M');
            }

            $userCounts = $this->getDailyCounts(User::query(), $days);
            $healthRecordCounts = $this->getDailyCounts(HealthRecord::query(), $days);

            $chartData['series'] = [
                [
                    'name' => 'Total Pengguna Baru',
                    'data' => $userCounts,
                ],
                [
                    'name' => 'Input Rekam Medis',
                    'data' => $healthRecordCounts,
                ]
            ];
        }

        if ($period === 'all') {
            $totalUser = User::count();
            $totalHealthRecord = HealthRecord::count();
        } else {
            $totalUser = $userQuery->count();
            $totalHealthRecord = $healthRecordQuery->count();
        }

        return Inertia::render('dashboard/dashboard', [
            'user' => $user,
            'totalUser' => $totalUser,
            'totalHealthRecord' => $totalHealthRecord,
            'chartData' => $chartData,
            'filters' => ['period' => $period],
        ]);
    }

    /**
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $months
     * @return array
     */
    private function getMonthlyCounts($query, int $months): array
    {
        $monthlyCounts = [];
        $startDate = Carbon::now()->subMonths($months - 1)->startOfMonth();

        for ($i = 0; $i < $months; $i++) {
            $month = $startDate->copy()->addMonths($i)->format('Y-m');
            $monthlyCounts[$month] = 0;
        }

        $dbData = $query
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths($months)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->keyBy('month');

        foreach ($dbData as $month => $data) {
            if (isset($monthlyCounts[$month])) {
                $monthlyCounts[$month] = $data->count;
            }
        }

        return array_values($monthlyCounts);
    }

    /**
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $days
     * @return array
     */
    private function getDailyCounts($query, int $days): array
    {
        $dailyCounts = [];
        $startDate = Carbon::now()->subDays($days - 1);
        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->copy()->addDays($i)->format('Y-m-d');
            $dailyCounts[$date] = 0;
        }

        $dbData = $query
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', Carbon::now()->subDays($days)->startOfDay())
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy('date');

        foreach ($dbData as $date => $data) {
            if (isset($dailyCounts[$date])) {
                $dailyCounts[$date] = $data->count;
            }
        }

        return array_values($dailyCounts);
    }
}
