import HealthRecord from '@/admin/pages/dashboard/health-record';
import BiWeeklyCalendar from '@/pwa/components/biweekly-calendar';
import { Calendar } from '@/pwa/components/ui/calendar';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/pwa/components/ui/carousel';
import WeeklyCalendar from '@/pwa/components/weekly-calendar';
import PwaMainLayout from '@/pwa/layouts/pwa-main-layout';
import { UserType } from '@/pwa/types/userType';
import AutoPlay from 'embla-carousel-autoplay';
import { Bell, CheckCircle, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface HomeProps {
    user: UserType;
}

export default function Home({ user }: HomeProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());
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
    const plugin = useRef(AutoPlay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }));

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

    const dates = [
        { date: 11, day: 'Mon' },
        { date: 12, day: 'Tue' },
        { date: 13, day: 'Wed' },
        { date: 14, day: 'Thu' },
        { date: 15, day: 'Fri' },
    ];

    const healthMetrics = [
        { title: 'Glucose Level', value: '89,65%', icon: 'glucose' },
        { title: 'Blood Status', value: '70,90%', icon: 'blood' },
        { title: 'Blood Count', value: '90,88%', icon: 'count' },
    ];

    const healthSummary = [
        {
            label: 'Gula Darah',
            value: '95',
            unit: 'mg/dL',
            status: 'normal',
            bgColor: 'bg-green-50',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
        },
        {
            label: 'Kolesterol',
            value: '180',
            unit: 'mg/dL',
            status: 'normal',
            bgColor: 'bg-green-50',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
        },
        {
            label: 'Asam Urat',
            value: '5.5',
            unit: 'mg/dL',
            status: 'normal',
            bgColor: 'bg-green-50',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
        },
    ];

    const healthCards = [
        {
            title: 'Heart Rate',
            value: '80',
            unit: '/bpm',
            bgColor: 'bg-green-300',
            icon: (
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            ),
            chart: (
                <svg className="h-8 w-full" viewBox="0 0 120 30">
                    <path
                        d="M5,15 L15,15 L20,8 L25,22 L30,5 L35,25 L40,15 L50,15 L55,12 L60,18 L65,10 L70,20 L75,15 L85,15 L90,12 L95,18 L100,10 L105,20 L110,15 L115,15"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.8"
                    />
                </svg>
            ),
        },
        {
            title: 'Sleep Rate',
            value: '9',
            unit: '/hours',
            bgColor: 'bg-teal-400',
            icon: (
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                </svg>
            ),
            chart: (
                <div className="flex h-8 items-end justify-center space-x-1">
                    {[2, 4, 3, 6, 4, 3, 5, 2, 4].map((height, index) => (
                        <div
                            key={index}
                            className="rounded-sm bg-white opacity-80"
                            style={{
                                width: '4px',
                                height: `${height * 4}px`,
                            }}
                        ></div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Water Intake',
            value: '2.5',
            unit: '/liters',
            bgColor: 'bg-blue-400',
            icon: (
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M21,9V7L15,1H9V3H15V9H21M21,11H9A2,2 0 0,0 7,13V21A2,2 0 0,0 9,23H21A2,2 0 0,0 23,21V13A2,2 0 0,0 21,11Z" />
                </svg>
            ),
            chart: (
                <div className="flex h-8 items-end justify-center space-x-1">
                    {[3, 5, 2, 4, 6, 3, 4, 5, 3].map((height, index) => (
                        <div
                            key={index}
                            className="rounded-full bg-white opacity-80"
                            style={{
                                width: '3px',
                                height: `${height * 3}px`,
                            }}
                        ></div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Blood Pressure',
            value: '120/80',
            unit: 'mmHg',
            bgColor: 'bg-purple-400',
            icon: (
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            ),
            chart: (
                <svg className="h-8 w-full" viewBox="0 0 120 30">
                    <path
                        d="M5,20 Q15,10 25,20 T45,20 Q55,10 65,20 T85,20 Q95,10 105,20 T115,20"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.8"
                    />
                </svg>
            ),
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
        // {
        //     id: 2,
        //     type: 'info',
        //     title: 'Reminder Pemeriksaan',
        //     message: 'Waktunya cek kolesterol minggu ini',
        //     bgColor: 'bg-gray-50',
        //     borderColor: 'border-gray-200',
        //     textColor: 'text-gray-700',
        //     iconColor: 'text-gray-500',
        //     icon: <Users className="w-5 h-5" />,
        //     hasButton: false
        // },
        // {
        //     id: 3,
        //     type: 'success',
        //     title: 'Pembayaran Diterima!',
        //     message: 'Pembayaran pemeriksaan lab berhasil',
        //     bgColor: 'bg-green-50',
        //     borderColor: 'border-green-200',
        //     textColor: 'text-green-800',
        //     iconColor: 'text-green-500',
        //     icon: <CreditCard className="w-5 h-5" />,
        //     hasButton: true,
        //     buttonText: 'Lihat Saldo',
        //     buttonColor: 'bg-green-500'
        // },
        // {
        //     id: 4,
        //     type: 'warning',
        //     title: 'Peringatan!',
        //     message: 'Hasil gula darah Anda sedikit tinggi',
        //     bgColor: 'bg-yellow-50',
        //     borderColor: 'border-yellow-200',
        //     textColor: 'text-yellow-800',
        //     iconColor: 'text-yellow-600',
        //     icon: <AlertTriangle className="w-5 h-5" />,
        //     hasButton: false
        // }
    ];
    const [dismissedReminders, setDismissedReminders] = useState<number[]>([]);
    const [date, setDate] = useState<Date | undefined>(new Date());

    const handleDismissReminder = (id: number) => {
        setDismissedReminders((prev) => [...prev, id]);
    };

    const visibleReminders = reminders.filter((reminder) => !dismissedReminders.includes(reminder.id));
    return (
        <PwaMainLayout user={user}>
            <div className="min-h-screen bg-gray-50 px-4 py-6">
                <div className="bg-gray-50">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600">
                                <span className="text-xl font-bold text-white">J</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">James Anderson</h1>
                                <p className="text-sm text-gray-500">Male, 35 Years Old</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-600">
                                <Search className="h-6 w-6" strokeWidth={3} />
                            </button>
                            <button className="text-gray-600">
                                <Bell className="h-6 w-6" strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Doctor Card */}
                <div className="relative mb-6">
                    <Carousel
                        plugins={[plugin.current]}
                        setApi={setApi}
                        className="w-full"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent>
                            {doctors.map((doctor, index) => (
                                <CarouselItem key={index}>
                                    <div className="py-1">
                                        <div className="flex rounded-3xl bg-gradient-to-br from-teal-400 to-teal-600 p-6">
                                            <div className="flex-1">
                                                <h2 className="mb-2 text-2xl font-bold text-white">{doctor.name}</h2>
                                                <p className="mb-3 text-[17px] text-white/90">{doctor.specialty}</p>

                                                {/* Rating */}
                                                <div className="flex items-center">
                                                    <div className="mr-2 flex space-x-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className="h-4 w-4 fill-current text-yellow-300" viewBox="0 0 20 20">
                                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="font-semibold text-white">{doctor.rating.toFixed(1)}</span>
                                                </div>
                                                <div className="mb-6 text-white">{doctor.reviews} Review</div>

                                                {/* Action buttons */}
                                                <div className="flex space-x-4">
                                                    <button className="rounded-xl bg-white/20 p-3">
                                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <button className="rounded-xl bg-white/20 p-3">
                                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <button className="rounded-xl bg-white/20 p-3">
                                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 7V3a4 4 0 118 0v4m-4 7v4m-4-7v4m8-11v11"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Dots indicator */}
                                                <div className="mt-6 flex space-x-2">
                                                    {doctors.map((_, index) => (
                                                        <div
                                                            key={index}
                                                            className={`h-1 rounded-full transition-all ${
                                                                current === index ? 'w-6 bg-white' : 'w-1 bg-white/50'
                                                            }`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Doctor Image */}
                                            <div className="ml-4 flex h-40 w-32 items-center justify-center rounded-2xl bg-gray-300">
                                                <img src={doctor.image} alt={doctor.name} className="h-full w-full rounded-2xl object-cover" />
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                {/* Reminder Section */}
                {/* <div className="mb-6">
                    <div className="space-y-3">
                        {visibleReminders.map((reminder) => (
                            <div
                                key={reminder.id}
                                className={`${reminder.bgColor} ${reminder.borderColor} border rounded-xl p-4 relative`}
                            >
                                <button
                                    onClick={() => handleDismissReminder(reminder.id)}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="flex items-start space-x-3 pr-6">
                                    <div className={`${reminder.iconColor} mt-0.5`}>
                                        {reminder.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-semibold ${reminder.textColor} mb-1`}>
                                            {reminder.title}
                                        </h3>
                                        <p className={`${reminder.textColor} opacity-80 text-sm`}>
                                            {reminder.message}
                                        </p>

                                        {reminder.hasButton && (
                                            <button
                                                className={`${reminder.buttonColor} text-white px-4 py-2 rounded-lg text-sm font-medium mt-3 hover:opacity-90 transition-opacity`}
                                            >
                                                {reminder.buttonText}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Calendar Section */}
                <div className="mb-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800">Calendar</h3>
                        <div className="rounded-full border border-gray-200 bg-white px-4 py-2">
                            <select className="bg-transparent text-gray-600 outline-none" value={viewMode} onChange={handleViewModeChange}>
                                <option value="Weekly">Weekly</option>
                                <option value="Biweekly">Biweekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    {/* Date selector */}
                    {/* <div className="mb-6 flex space-x-4">
                        {dates.map((item) => (
                            <div
                                key={item.date}
                                className={`flex cursor-pointer flex-col items-center rounded-2xl p-3 ${
                                    selectedDate === item.date ? 'bg-red-400 text-white' : 'text-gray-600'
                                }`}
                                onClick={() => setSelectedDate(item.date)}
                            >
                                <span className="text-2xl font-bold">{item.date}</span>
                                <span className="text-sm">{item.day}</span>
                            </div>
                        ))}
                    </div> */}
                    {viewMode === 'Weekly' ? (
                        <div className="mt-4">
                            <WeeklyCalendar selected={selectedDate} onSelect={setSelectedDate} />
                        </div>
                    ) : viewMode === 'Biweekly' ? (
                        <BiWeeklyCalendar selected={selectedDate} onSelect={setSelectedDate} />
                    ) : (
                        <Calendar className="w-full bg-transparent p-0 text-black" mode="single" selected={date} onSelect={setDate} />
                    )}
                </div>

                {/* Health Metrics */}
                {/* <div className="grid grid-cols-3 gap-4 mb-6">
                    {healthMetrics.map((metric, index) => (
                        <div key={index} className="bg-white rounded-2xl p-4 text-center">
                            <h4 className="text-gray-600 text-sm mb-3">{metric.title}</h4>

                            <div className="h-12 mb-3 flex items-end justify-center">
                                <svg className="w-16 h-8" viewBox="0 0 60 30">
                                    <path
                                        d="M5,25 L15,20 L20,15 L25,22 L30,18 L35,12 L40,20 L45,15 L50,20 L55,25"
                                        stroke="#374151"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                </svg>
                            </div>

                            <div className="flex items-center justify-center">
                                <span className="font-bold text-gray-800">{metric.value}</span>
                                <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div> */}

                {/* Additional Health Cards - 4 Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {healthCards.map((card, index) => (
                        <div key={index} className={`${card.bgColor} rounded-3xl p-6 text-white`}>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl bg-white/20 p-2">{card.icon}</div>
                            </div>

                            <h3 className="mb-4 text-sm font-medium text-white/90">{card.title}</h3>

                            {/* Chart area */}
                            <div className="mb-4 h-8">{card.chart}</div>

                            {/* Value */}
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold">{card.value}</span>
                                <span className="ml-1 text-sm text-white/80">{card.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PwaMainLayout>
    );
}
