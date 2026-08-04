import BiWeeklyCalendar from '@/pwa/components/biweekly-calendar';
import { Calendar } from '@/pwa/components/ui/calendar';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/pwa/components/ui/carousel';
import WeeklyCalendar from '@/pwa/components/weekly-calendar';
import PwaMainLayout from '@/pwa/layouts/pwa-main-layout';
import { UserType } from '@/pwa/types/userType';
import { router } from '@inertiajs/react';
import AutoPlay from 'embla-carousel-autoplay';
import { Activity, CheckCircle, Droplets, Gauge, Heart, Minus, Pill, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface HealthRecord {
    id: number;
    sugar_fasting: number | null;
    sugar_after_meal: number | null;
    sugar_random: number | null;
    cholesterol_total: number | null;
    triglycerides: number | null;
    hdl: number | null;
    ldl: number | null;
    uric_acid: number | null;
    systolic: number | null;
    diastolic: number | null;
    recorded_at: string;
}

interface TrendDataPoint {
    date: string;
    sugar_fasting: number;
    cholesterol_total: number;
    uric_acid: number;
    day: string;
}

interface HealthSummary {
    total_records: number;
    normal_count: number;
    abnormal_count: number;
    last_check: string | null;
}

interface BannerProps {
    id: string;
    full_image_url: string;
    is_active: boolean;
    order: number;
}

interface HomeProps {
    user: UserType;
    selectedDate: string;
    healthRecord: HealthRecord | null;
    healthSummary: HealthSummary;
    trendData: TrendDataPoint[];
    banners: BannerProps[];
}

export default function Home({ user, selectedDate, healthRecord, healthSummary, trendData, banners }: HomeProps) {
    const [currentSelectedDate, setCurrentSelectedDate] = useState(new Date(selectedDate));
    const [viewMode, setViewMode] = useState('Weekly');
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }
        setCurrent(api.selectedScrollSnap());

        const handleSelect = () => {
            setCurrent(api.selectedScrollSnap());
        };
        api.on('select', handleSelect);

        return () => {
            api.off('select', handleSelect);
        };
    }, [api]);

    const handleViewModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setViewMode(e.target.value);
    };

    const handleDateSelect = (date: Date) => {
        setCurrentSelectedDate(date);
        // Update URL dengan tanggal yang dipilih
        router.get(
            '/home',
            { date: date.toISOString().split('T')[0] },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const plugin = useRef(AutoPlay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }));

    // Generate mini chart untuk trend
    const generateMiniChart = (values: number[], color: string = 'white') => {
        const maxValue = Math.max(...values, 1);
        const points = values
            .map((value, index) => {
                const x = (index / (values.length - 1)) * 100;
                const y = 100 - (value / maxValue) * 80; // 80% of height for padding
                return `${x},${y}`;
            })
            .join(' ');

        return (
            <svg className="h-8 w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline fill="none" stroke={color} strokeWidth="3" points={points} opacity="0.8" />
            </svg>
        );
    };

    // Get status color and trend
    const getHealthStatus = (value: number | null, normalRange: { min: number; max: number }) => {
        if (!value) return { status: 'Tidak Ada Data', color: 'text-gray-400', trend: null };

        if (value >= normalRange.min && value <= normalRange.max) {
            return { status: 'Normal', color: 'text-green-600', trend: null };
        } else if (value > normalRange.max) {
            return { status: 'Tinggi', color: 'text-red-600', trend: 'up' };
        } else {
            return { status: 'Rendah', color: 'text-blue-600', trend: 'down' };
        }
    };

    const getTrendIcon = (trend: string | null) => {
        if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
        if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
        return <Minus className="h-4 w-4" />;
    };

    const getBloodPressureStatus = (systolic: number | null, diastolic: number | null) => {
        if (!systolic && !diastolic) return { status: 'Tidak Ada Data', color: 'text-gray-400', trend: null };

        const isHigh = (systolic && systolic >= 140) || (diastolic && diastolic >= 90);
        const isLow = (systolic && systolic < 90) || (diastolic && diastolic < 60);

        if (isHigh) return { status: 'Tinggi', color: 'text-red-600', trend: 'up' };
        if (isLow) return { status: 'Rendah', color: 'text-blue-600', trend: 'down' };
        return { status: 'Normal', color: 'text-green-600', trend: null };
    };

    // Health cards berdasarkan data real
    const healthCards = [
        {
            title: 'Tekanan Darah',
            value: healthRecord?.systolic && healthRecord?.diastolic ? `${healthRecord.systolic}/${healthRecord.diastolic}` : '-',
            unit: 'mmHg',
            bgColor: 'bg-gradient-to-br from-rose-400 to-rose-500',
            icon: <Gauge className="h-6 w-6 text-white" />,
            chart: <div className="h-6" />,
            status: getBloodPressureStatus(healthRecord?.systolic || null, healthRecord?.diastolic || null),
            normalRange: '90-139 / 60-89 mmHg',
        },
        {
            title: 'Gula Darah Puasa',
            value: healthRecord?.sugar_fasting?.toString() || '-',
            unit: 'mg/dL',
            bgColor: 'bg-gradient-to-br from-green-400 to-green-500',
            icon: <Droplets className="h-6 w-6 text-white" />,
            chart: generateMiniChart(
                trendData.map((d) => d.sugar_fasting),
                'white',
            ),
            status: getHealthStatus(healthRecord?.sugar_fasting || null, { min: 70, max: 100 }),
            normalRange: '70-100 mg/dL',
        },
        {
            title: 'Kolesterol Total',
            value: healthRecord?.cholesterol_total?.toString() || '-',
            unit: 'mg/dL',
            bgColor: 'bg-gradient-to-br from-orange-400 to-orange-500',
            icon: <Heart className="h-6 w-6 text-white" />,
            chart: generateMiniChart(
                trendData.map((d) => d.cholesterol_total),
                'white',
            ),
            status: getHealthStatus(healthRecord?.cholesterol_total || null, { min: 0, max: 200 }),
            normalRange: '< 200 mg/dL',
        },
        {
            title: 'Asam Urat',
            value: healthRecord?.uric_acid?.toString() || '-',
            unit: 'mg/dL',
            bgColor: 'bg-gradient-to-br from-purple-400 to-purple-500',
            icon: <Activity className="h-6 w-6 text-white" />,
            chart: generateMiniChart(
                trendData.map((d) => d.uric_acid),
                'white',
            ),
            status: getHealthStatus(healthRecord?.uric_acid || null, {
                min: 0,
                max: user.gender === 'male' ? 7 : 6,
            }),
            normalRange: user.gender === 'male' ? '< 7 mg/dL' : '< 6 mg/dL',
        },
        {
            title: 'Ringkasan Bulan Ini',
            value: healthSummary.total_records.toString(),
            unit: 'pemeriksaan',
            bgColor: 'bg-gradient-to-br from-teal-400 to-teal-500',
            icon: <CheckCircle className="h-6 w-6 text-white" />,
            chart: (
                <div className="flex h-8 items-end justify-center space-x-1">
                    <div className="flex items-end space-x-1">
                        <div
                            className="rounded-sm bg-white opacity-80"
                            style={{
                                width: '8px',
                                height: `${Math.max((healthSummary.normal_count / Math.max(healthSummary.total_records, 1)) * 32, 4)}px`,
                            }}
                        ></div>
                        <div
                            className="rounded-sm bg-white opacity-60"
                            style={{
                                width: '8px',
                                height: `${Math.max((healthSummary.abnormal_count / Math.max(healthSummary.total_records, 1)) * 32, 4)}px`,
                            }}
                        ></div>
                    </div>
                </div>
            ),
            status: {
                status: `${healthSummary.normal_count} Normal`,
                color: 'text-green-100',
                trend: null,
            },
            normalRange: `${healthSummary.abnormal_count} Perlu Perhatian`,
        },
    ];

    const doctors = [
        {
            name: 'Dr. Lily Turner',
            specialty: 'Radiology Specialist',
            rating: 5.0,
            reviews: 1532,
            image: '/images/doctor-2.png',
        },
        {
            name: 'Dr. Sarah',
            specialty: 'Cardiology Specialist',
            rating: 4.8,
            reviews: 1200,
            image: '/images/doctor-1.png',
        },
        {
            name: 'Dr. Jhonson ',
            specialty: 'Ortopedy Specialist',
            rating: 4.9,
            reviews: 980,
            image: '/images/doctor-3.png',
        },
    ];

    const reminders = [
        {
            id: 1,
            type: 'success',
            title: 'Pemeriksaan Berhasil!',
            message: 'Hasil lab Anda sudah tersedia',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-500',
            icon: <CheckCircle className="h-5 w-5" />,
            hasButton: true,
            buttonText: 'Lihat Hasil',
            buttonColor: 'bg-blue-500',
        },
    ];

    const [dismissedReminders, setDismissedReminders] = useState<number[]>([]);

    const handleDismissReminder = (id: number) => {
        setDismissedReminders((prev) => [...prev, id]);
    };

    const visibleReminders = reminders.filter((reminder) => !dismissedReminders.includes(reminder.id));

    return (
        <PwaMainLayout user={user}>
            {/* Date Info */}
            <div className="mb-4 text-center">
                <p className="text-sm text-gray-600">
                    Data untuk tanggal:{' '}
                    <span className="font-semibold text-teal-600">
                        {new Date(selectedDate).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </span>
                </p>
                {healthRecord && (
                    <p className="mt-1 text-xs text-gray-500">
                        Pemeriksaan terakhir:{' '}
                        {new Date(healthRecord.recorded_at).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                )}
            </div>

            {/* Doctor Card - tetap sama */}
            <div className="relative mb-6">
                <Carousel
                    plugins={[plugin.current]}
                    setApi={setApi}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent>
                        {banners.map((banner) => (
                            <CarouselItem key={banner.id}>
                                <div>
                                    <img
                                        src={banner.full_image_url}
                                        alt={`Banner ${banner.id}`}
                                        className="aspect-video w-full rounded-2xl object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}

                        <img src="" alt="" />
                    </CarouselContent>
                </Carousel>
            </div>

            {/* Calendar Section */}
            <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">Pilih Tanggal</h3>
                    <div className="rounded-full border border-gray-200 bg-white px-4 py-2">
                        <select className="bg-transparent text-gray-600 outline-none" value={viewMode} onChange={handleViewModeChange}>
                            <option value="Weekly">Weekly</option>
                            <option value="Biweekly">Biweekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                </div>

                {/* Date selector */}
                {viewMode === 'Weekly' ? (
                    <div className="mt-4">
                        <WeeklyCalendar selected={currentSelectedDate} onSelect={handleDateSelect} />
                    </div>
                ) : viewMode === 'Biweekly' ? (
                    <BiWeeklyCalendar selected={currentSelectedDate} onSelect={handleDateSelect} />
                ) : (
                    <Calendar
                        className="w-full bg-transparent p-0 text-black"
                        mode="single"
                        selected={currentSelectedDate}
                        onSelect={(date) => date && handleDateSelect(date)}
                    />
                )}
            </div>

            {/* Health Cards - Updated dengan data real */}
            <div className="grid grid-cols-2 gap-4">
                {healthCards.map((card, index) => (
                    <div key={index} className={`${card.bgColor} rounded-3xl p-4 text-white`}>
                        <div className="mb-3 flex items-center justify-between">
                            <div className="rounded-xl bg-white/20 p-2">{card.icon}</div>
                            <div className={`${card.status.color}`}>{getTrendIcon(card.status.trend)}</div>
                        </div>

                        <h3 className="mb-2 text-xs font-medium text-white/90">{card.title}</h3>

                        {/* Chart area */}
                        <div className="mb-3 h-6">{card.chart}</div>

                        {/* Value */}
                        <div className="mb-1 flex items-baseline">
                            <span className="text-xl font-bold">{card.value}</span>
                            <span className="ml-1 text-xs text-white/80">{card.unit}</span>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col">
                            <span className="text-xs text-white/90">{card.status.status}</span>
                            <span className="text-xs text-white/70">{card.normalRange}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                    onClick={() => router.visit('/examinations/add')}
                    className="flex items-center space-x-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                        <Droplets className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800">Tambah Hasil</p>
                        <p className="text-xs text-gray-600">Pemeriksaan Lab</p>
                    </div>
                </button>

                <button
                    onClick={() => router.visit('/history')}
                    className="flex items-center space-x-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800">Lihat Riwayat</p>
                        <p className="text-xs text-gray-600">Semua Pemeriksaan</p>
                    </div>
                </button>

                <button
                    onClick={() => router.visit('/obat')}
                    className="flex items-center space-x-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <Pill className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800">Obat Saya</p>
                        <p className="text-xs text-gray-600">Terapi & Riwayat Obat</p>
                    </div>
                </button>
            </div>

            {/* Spacer */}
            <div className="h-24"></div>
        </PwaMainLayout>
    );
}
