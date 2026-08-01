import AppBar from '@/pwa/components/shared/app-bar';
import AppBarHome from '@/pwa/components/shared/app-bar-home';
import PwaMainLayout from '@/pwa/layouts/pwa-main-layout';
import { UserType } from '@/pwa/types/userType';
import { Link, router } from '@inertiajs/react';
import ReactECharts from 'echarts-for-react';
import { Activity, Award, BarChart3, Calendar, Droplets, Heart, Info, Minus, Pill, Target, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';

interface TrendDataPoint {
    date: string;
    sugar_fasting: number;
    sugar_after_meal: number;
    sugar_random: number;
    cholesterol_total: number;
    triglycerides: number;
    hdl: number;
    ldl: number;
    uric_acid: number;
    recorded_at: string;
}

interface SummaryStats {
    total_checks: number;
    avg_sugar_fasting: number;
    avg_cholesterol: number;
    avg_uric_acid: number;
    trend_sugar: 'increasing' | 'decreasing' | 'stable';
    trend_cholesterol: 'increasing' | 'decreasing' | 'stable';
    trend_uric_acid: 'increasing' | 'decreasing' | 'stable';
}

interface HealthInsights {
    message: string;
    type: 'success' | 'warning' | 'info';
}

interface GaugeData {
    health_score: number;
    score_level: string;
    color: string;
    breakdown: Record<string, number>;
}

interface HeatmapDataPoint {
    date: string;
    intensity: number;
    status: 'empty' | 'normal' | 'warning' | 'danger' | 'checked';
    count: number;
    record_ids: number[];
}

interface MedicationPeriod {
    id: number;
    nama_obat: string;
    status: 'aktif' | 'dosis_diubah' | 'dihentikan';
    tanggal_mulai: string;
    tanggal_selesai: string | null;
}

interface PeriodRange {
    start: string;
    end: string;
}

interface TrendProps {
    user: UserType;
    trendData: TrendDataPoint[];
    summaryStats: SummaryStats;
    insights: HealthInsights;
    currentPeriod: string;
    gaugeData: GaugeData;
    heatmapData: HeatmapDataPoint[];
    medicationPeriods: MedicationPeriod[];
    periodRange: PeriodRange;
}

const medicationStatusLabel: Record<string, string> = {
    aktif: 'Aktif',
    dosis_diubah: 'Dosis Diubah',
    dihentikan: 'Dihentikan',
};

const medicationStatusColor: Record<string, string> = {
    aktif: 'bg-teal-500',
    dosis_diubah: 'bg-yellow-500',
    dihentikan: 'bg-gray-400',
};

export default function Trend({
    user,
    trendData,
    summaryStats,
    insights,
    currentPeriod,
    gaugeData,
    heatmapData,
    medicationPeriods,
    periodRange,
}: TrendProps) {
    const [selectedMetrics, setSelectedMetrics] = useState(['sugar_fasting', 'cholesterol_total', 'uric_acid']);

    const periods = [
        { value: '1M', label: '1 Bulan' },
        { value: '3M', label: '3 Bulan' },
        { value: '6M', label: '6 Bulan' },
        { value: '1Y', label: '1 Tahun' },
    ];

    const metrics = [
        {
            key: 'sugar_fasting',
            name: 'Gula Darah Puasa',
            color: '#10b981',
            icon: <Droplets className="h-4 w-4" />,
            unit: 'mg/dL',
            normalRange: '70-100',
        },
        {
            key: 'sugar_after_meal',
            name: 'Gula Darah 2J PP',
            color: '#06b6d4',
            icon: <Droplets className="h-4 w-4" />,
            unit: 'mg/dL',
            normalRange: '< 140',
        },
        {
            key: 'cholesterol_total',
            name: 'Kolesterol Total',
            color: '#f59e0b',
            icon: <Heart className="h-4 w-4" />,
            unit: 'mg/dL',
            normalRange: '< 200',
        },
        {
            key: 'uric_acid',
            name: 'Asam Urat',
            color: '#8b5cf6',
            icon: <Activity className="h-4 w-4" />,
            unit: 'mg/dL',
            normalRange: user.gender === 'male' ? '< 7' : '< 6',
        },
    ];

    const handlePeriodChange = (period: string) => {
        router.get(
            '/trends',
            { period },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleMetricToggle = (metricKey: string) => {
        setSelectedMetrics((prev) => (prev.includes(metricKey) ? prev.filter((m) => m !== metricKey) : [...prev, metricKey]));
    };

    const getTrendIcon = (trend: string) => {
        if (trend === 'increasing') return <TrendingUp className="h-4 w-4 text-red-500" />;
        if (trend === 'decreasing') return <TrendingDown className="h-4 w-4 text-green-500" />;
        return <Minus className="h-4 w-4 text-gray-500" />;
    };

    const getTrendColor = (trend: string) => {
        if (trend === 'increasing') return 'text-red-600 bg-red-50';
        if (trend === 'decreasing') return 'text-green-600 bg-green-50';
        return 'text-gray-600 bg-gray-50';
    };

    // ECharts configuration
    const chartOption = useMemo(() => {
        if (trendData.length === 0) return {};

        const selectedMetricsData = metrics.filter((metric) => selectedMetrics.includes(metric.key));

        return {
            title: {
                text: 'Trend Kesehatan',
                left: 'center',
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#374151',
                },
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                textStyle: {
                    color: '#374151',
                },
                formatter: function (params: any) {
                    let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
                    params.forEach((param: any) => {
                        const metric = selectedMetricsData.find((m) => m.name === param.seriesName);
                        result += `
                            <div style="display: flex; align-items: center; margin: 4px 0;">
                                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                                <span style="flex: 1;">${param.seriesName}:</span>
                                <span style="font-weight: bold; margin-left: 8px;">${param.value} ${metric?.unit}</span>
                            </div>
                        `;
                    });
                    return result;
                },
            },
            legend: {
                data: selectedMetricsData.map((metric) => metric.name),
                top: 40,
                textStyle: {
                    fontSize: 12,
                    color: '#6b7280',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '25%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: trendData.map((item) => {
                    const date = new Date(item.date);
                    return date.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                    });
                }),
                axisLine: {
                    lineStyle: {
                        color: '#e5e7eb',
                    },
                },
                axisLabel: {
                    color: '#6b7280',
                    fontSize: 11,
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#6b7280',
                    fontSize: 11,
                },
                splitLine: {
                    lineStyle: {
                        color: '#f3f4f6',
                    },
                },
            },
            series: selectedMetricsData.map((metric) => ({
                name: metric.name,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    width: 3,
                    color: metric.color,
                },
                itemStyle: {
                    color: metric.color,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: metric.color + '20',
                            },
                            {
                                offset: 1,
                                color: metric.color + '05',
                            },
                        ],
                    },
                },
                data: trendData.map((item) => item[metric.key as keyof TrendDataPoint] || 0),
                animationDuration: 2000,
                animationEasing: 'cubicOut',
            })),
            animation: true,
            animationDuration: 2000,
            animationEasing: 'cubicOut',
        };
    }, [trendData, metrics, selectedMetrics]);

    // Gauge Chart Configuration
    const gaugeOption = useMemo(
        () => ({
            series: [
                {
                    type: 'gauge',
                    center: ['50%', '60%'],
                    startAngle: 200,
                    endAngle: -20,
                    min: 0,
                    max: 100,
                    splitNumber: 5,
                    itemStyle: {
                        color: gaugeData.color,
                        shadowColor: 'rgba(0,0,0,0.45)',
                        shadowBlur: 10,
                        shadowOffsetX: 2,
                        shadowOffsetY: 2,
                    },
                    progress: {
                        show: true,
                        width: 30,
                    },
                    pointer: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            width: 30,
                        },
                    },
                    axisTick: {
                        distance: -45,
                        splitNumber: 5,
                        lineStyle: {
                            width: 2,
                            color: '#999',
                        },
                    },
                    splitLine: {
                        distance: -52,
                        length: 14,
                        lineStyle: {
                            width: 3,
                            color: '#999',
                        },
                    },
                    axisLabel: {
                        distance: -20,
                        color: '#999',
                        fontSize: 20,
                    },
                    anchor: {
                        show: false,
                    },
                    title: {
                        show: false,
                    },
                    detail: {
                        valueAnimation: true,
                        width: '60%',
                        lineHeight: 40,
                        borderRadius: 8,
                        offsetCenter: [0, '-15%'],
                        fontSize: 40,
                        fontWeight: 'bolder',
                        formatter: '{value}',
                        color: 'inherit',
                    },
                    data: [
                        {
                            value: gaugeData.health_score,
                        },
                    ],
                },
            ],
        }),
        [gaugeData],
    );

    // Medication timeline positioning within the selected period
    const medicationTimeline = useMemo(() => {
        const rangeStart = new Date(periodRange.start).getTime();
        const rangeEnd = new Date(periodRange.end).getTime();
        const totalMs = rangeEnd - rangeStart || 1;

        return medicationPeriods.map((item) => {
            const itemStart = new Date(item.tanggal_mulai).getTime();
            const itemEnd = item.tanggal_selesai ? new Date(item.tanggal_selesai).getTime() : rangeEnd;

            const clampedStart = Math.min(Math.max(itemStart, rangeStart), rangeEnd);
            const clampedEnd = Math.min(Math.max(itemEnd, rangeStart), rangeEnd);

            const left = ((clampedStart - rangeStart) / totalMs) * 100;
            const width = Math.max(((clampedEnd - clampedStart) / totalMs) * 100, 1.5);

            return { ...item, left, width };
        });
    }, [medicationPeriods, periodRange]);

    // Heatmap Calendar Component
    const HeatmapCalendar = ({ data }: { data: HeatmapDataPoint[] }) => {
        const getStatusColor = (status: string, intensity: number) => {
            switch (status) {
                case 'normal':
                    return 'bg-green-200';
                case 'warning':
                    return 'bg-yellow-200';
                case 'danger':
                    return 'bg-red-200';
                case 'checked':
                    return 'bg-blue-100';
                default:
                    return 'bg-gray-100';
            }
        };

        const getIntensityOpacity = (intensity: number) => {
            switch (intensity) {
                case 1:
                    return 'opacity-40';
                case 2:
                    return 'opacity-70';
                case 3:
                    return 'opacity-100';
                default:
                    return 'opacity-20';
            }
        };

        // Create complete calendar grid
        const createCalendarGrid = () => {
            if (data.length === 0) return [];

            const startDate = new Date(data[0].date);
            const endDate = new Date(data[data.length - 1].date);

            // Find the start of the week (Sunday) for the first date
            const gridStartDate = new Date(startDate);
            const dayOfWeek = gridStartDate.getDay();
            gridStartDate.setDate(gridStartDate.getDate() - dayOfWeek);

            // Find the end of the week (Saturday) for the last date
            const gridEndDate = new Date(endDate);
            const endDayOfWeek = gridEndDate.getDay();
            gridEndDate.setDate(gridEndDate.getDate() + (6 - endDayOfWeek));

            // Create data map for quick lookup
            const dataMap = new Map();
            data.forEach((item) => {
                dataMap.set(item.date, item);
            });

            // Generate all days in the grid
            const weeks = [];
            let currentWeek = [];

            for (let d = new Date(gridStartDate); d <= gridEndDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                const dayData = dataMap.get(dateStr) || {
                    date: dateStr,
                    intensity: 0,
                    status: 'empty',
                    count: 0,
                };

                currentWeek.push(dayData);

                // If it's Saturday (day 6) or the last day, push the week
                if (d.getDay() === 6 || d.getTime() === gridEndDate.getTime()) {
                    weeks.push([...currentWeek]);
                    currentWeek = [];
                }
            }

            return weeks;
        };

        const weeks = createCalendarGrid();

        console.log(weeks);

        // Day labels
        const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        return (
            <div className="w-full">
                {/* Day labels */}
                <div className="mb-2 flex">
                    <div className="w-8"></div> {/* Space for month labels */}
                    {dayLabels.map((day, index) => (
                        <div key={index} className="flex-1 text-center text-xs font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="space-y-1">
                    {weeks.map((week, weekIndex) => {
                        // Get month label for first day of week
                        const firstDayOfWeek = new Date(week[0].date);
                        const showMonthLabel =
                            weekIndex === 0 || (weekIndex > 0 && firstDayOfWeek.getMonth() !== new Date(weeks[weekIndex - 1][0].date).getMonth());

                        return (
                            <div key={weekIndex} className="flex items-center">
                                {/* Month label */}
                                <div className="w-8 pr-2 text-right text-xs text-gray-500">
                                    {showMonthLabel ? firstDayOfWeek.toLocaleDateString('id-ID', { month: 'short' }) : ''}
                                </div>

                                {/* Week days */}
                                <div className="flex flex-1 space-x-1">
                                    {week.map((day) => {
                                        const isToday = day.date === new Date().toISOString().split('T')[0];
                                        const isCurrentMonth =
                                            data.length > 0 &&
                                            new Date(day.date) >= new Date(data[0].date) &&
                                            new Date(day.date) <= new Date(data[data.length - 1].date);

                                        return (
                                            <Link
                                                href={`/examinations/${day.record_ids}`}
                                                as="div"
                                                className="flex-1"
                                                key={day.date}
                                                onClick={(e) => {
                                                    if (day.status === 'empty') e.preventDefault(); // cegah navigasi
                                                }}
                                            >
                                                <div
                                                    className={`aspect-square flex-1 rounded-sm border border-gray-200 ${getStatusColor(day.status, day.intensity)} ${getIntensityOpacity(day.intensity)} ${!isCurrentMonth ? 'opacity-30' : ''} ${isToday ? 'ring-2 ring-blue-400' : ''} cursor-pointer transition-all hover:ring-2 hover:ring-gray-400`}
                                                    title={`${new Date(day.date).toLocaleDateString('id-ID')}: ${day.count} pemeriksaan - ${day.status}`}
                                                />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Activity summary */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                        <span>Less</span>
                        <div className="flex space-x-1">
                            <div className="h-3 w-3 rounded-sm border bg-gray-100"></div>
                            <div className="h-3 w-3 rounded-sm border bg-green-200 opacity-40"></div>
                            <div className="h-3 w-3 rounded-sm border bg-green-200 opacity-70"></div>
                            <div className="h-3 w-3 rounded-sm border bg-green-200 opacity-100"></div>
                        </div>
                        <span>More</span>
                    </div>
                    <div>{data.filter((d) => d.count > 0).length} hari aktif</div>
                </div>
            </div>
        );
    };

    return (
        <PwaMainLayout user={user}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="mb-2 text-2xl font-bold text-gray-800">Trend Kesehatan</h1>
                <p className="text-gray-600">Pantau perkembangan kesehatan Anda dari waktu ke waktu</p>
            </div>

            {/* Period Selector */}
            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Periode</h3>
                <div className="grid grid-cols-4 gap-2">
                    {periods.map((period) => (
                        <button
                            key={period.value}
                            onClick={() => handlePeriodChange(period.value)}
                            className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${currentPeriod === period.value
                                ? 'bg-teal-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Stats - Update layout */}
            <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Pemeriksaan</p>
                            <p className="text-2xl font-bold text-gray-800">{summaryStats.total_checks}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <BarChart3 className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Rata-rata GDP</p>
                            <p className="text-2xl font-bold text-gray-800">{summaryStats.avg_sugar_fasting}</p>
                            <p className="text-xs text-gray-500">mg/dL</p>
                        </div>
                        <div className="flex items-center">{getTrendIcon(summaryStats.trend_sugar)}</div>
                    </div>
                </div>

                {/* <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Skor Kesehatan</p>
                            <p className="text-2xl font-bold text-gray-800">{gaugeData.health_score}</p>
                            <p className="text-xs text-gray-500">/100</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                            <Award className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Health Score Gauge & Activity Heatmap */}
            {/* <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-1">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800">Skor Kesehatan</h3>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <Target className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>

                    <ReactECharts option={gaugeOption} style={{ height: '200px', width: '100%' }} opts={{ renderer: 'svg' }} />

                    <div className="mt-4 text-center">
                        <p className="text-lg font-bold" style={{ color: gaugeData.color }}>
                            {gaugeData.score_level}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">Berdasarkan parameter kesehatan terkini</p>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <h4 className="mb-2 text-sm font-semibold text-gray-700">Breakdown Skor:</h4>
                        <div className="space-y-1">
                            {Object.entries(gaugeData.breakdown).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                    <span className="text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                                    <span className="font-medium">{value}/20</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Metric Selector - existing code */}
            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Parameter yang Ditampilkan</h3>
                <div className="grid grid-cols-2 gap-2">
                    {metrics.map((metric) => (
                        <button
                            key={metric.key}
                            onClick={() => handleMetricToggle(metric.key)}
                            className={`rounded-xl border-2 p-3 transition-all ${selectedMetrics.includes(metric.key)
                                ? 'border-teal-300 bg-teal-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: metric.color }}></div>
                                <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                            </div>
                            <p className="mt-1 text-left text-xs text-gray-500">Normal: {metric.normalRange}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chart - existing code */}
            <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                {trendData.length > 0 ? (
                    <ReactECharts option={chartOption} style={{ height: '400px', width: '100%' }} opts={{ renderer: 'svg' }} />
                ) : (
                    <div className="py-16 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <BarChart3 className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-gray-800">Belum Ada Data Trend</h3>
                        <p className="mb-4 text-gray-600">Tambahkan hasil pemeriksaan untuk melihat trend kesehatan Anda</p>
                        <button
                            onClick={() => router.visit('/examinations/add')}
                            className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700"
                        >
                            Tambah Pemeriksaan
                        </button>
                    </div>
                )}
            </div>

            {/* Medication Timeline */}
            <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Riwayat Obat</h3>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <Pill className="h-5 w-5 text-purple-600" />
                    </div>
                </div>

                {medicationTimeline.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {medicationTimeline.map((item) => (
                                <div key={item.id}>
                                    <div className="mb-1 flex items-center justify-between text-xs">
                                        <span className="font-medium text-gray-700">{item.nama_obat}</span>
                                        <span className="text-gray-500">{medicationStatusLabel[item.status]}</span>
                                    </div>
                                    <div className="relative h-3 w-full rounded-full bg-gray-100">
                                        <div
                                            className={`absolute h-3 rounded-full ${medicationStatusColor[item.status]}`}
                                            style={{ left: `${item.left}%`, width: `${item.width}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-xs text-gray-500">
                            Periode konsumsi obat dalam rentang waktu yang sama dengan grafik di atas &mdash; gunakan untuk melihat kaitan
                            antara obat dan perkembangan hasil pemeriksaan.
                        </p>
                    </>
                ) : (
                    <div className="py-6 text-center">
                        <p className="mb-3 text-sm text-gray-600">Belum ada catatan obat pada periode ini.</p>
                        <Link
                            href="/obat"
                            className="inline-block rounded-lg bg-teal-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                        >
                            Tambah Obat
                        </Link>
                    </div>
                )}
            </div>

            {/* Heatmap Calendar */}
            <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Aktivitas Pemeriksaan</h3>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <div className="min-w-[320px]">
                        <HeatmapCalendar data={heatmapData} />
                    </div>
                </div>

                {/* Enhanced Legend */}
                <div className="mt-6 border-t border-gray-100 pt-4">
                    <p className="mb-3 text-sm font-medium text-gray-700">Keterangan Status:</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 flex-shrink-0 rounded-sm border bg-gray-100"></div>
                            <span className="text-gray-600">Tidak ada pemeriksaan</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 flex-shrink-0 rounded-sm border bg-green-200 opacity-40"></div>
                            <span className="text-gray-600">Semua normal</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 flex-shrink-0 rounded-sm border bg-yellow-200 opacity-70"></div>
                            <span className="text-gray-600">Perlu perhatian</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 flex-shrink-0 rounded-sm border bg-red-200 opacity-100"></div>
                            <span className="text-gray-600">Tidak normal</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Insights - existing code */}
            <div
                className={`mb-6 rounded-2xl p-4 ${insights.type === 'success'
                    ? 'border border-green-200 bg-green-50'
                    : insights.type === 'warning'
                        ? 'border border-yellow-200 bg-yellow-50'
                        : 'border border-blue-200 bg-blue-50'
                    }`}
            >
                <div className="flex items-start space-x-3">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${insights.type === 'success' ? 'bg-green-100' : insights.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}
                    >
                        <Info
                            className={`h-4 w-4 ${insights.type === 'success' ? 'text-green-600' : insights.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                                }`}
                        />
                    </div>
                    <div className="flex-1">
                        <h3
                            className={`mb-1 font-semibold ${insights.type === 'success' ? 'text-green-800' : insights.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                                }`}
                        >
                            Insight Kesehatan
                        </h3>
                        <p
                            className={`text-sm ${insights.type === 'success' ? 'text-green-700' : insights.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                                }`}
                        >
                            {insights.message}
                        </p>
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="h-24"></div>
        </PwaMainLayout>
    );
}
