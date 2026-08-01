import AppBar from '@/pwa/components/shared/app-bar';
import PwaMainLayout from '@/pwa/layouts/pwa-main-layout';
import { UserType } from '@/pwa/types/userType';
import { Link } from '@inertiajs/react';
import { AlertTriangle, Calendar, CheckCircle, Eye, FileText, Image, Info, Pill } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface HealthRecord {
    id: number;
    user_id: number;
    sugar_fasting: number | null;
    sugar_after_meal: number | null;
    sugar_random: number | null;
    cholesterol_total: number | null;
    triglycerides: number | null;
    hdl: number | null;
    ldl: number | null;
    uric_acid: number | null;
    recorded_at: string;
    lab_document: string | null;
    type_document: string | null;
    created_at: string;
    updated_at: string;
    analysis?: Record<string, any[]>;
    overall_status?: {
        status: string;
        color: string;
        bgColor: string;
    };
}

interface ActiveMedication {
    id: number;
    nama_obat: string;
    dosis: string;
    frekuensi: string;
}

interface HistoryProps {
    user: UserType;
    healthRecords: {
        current_page: number;
        data: HealthRecord[];
        links: any[];
        meta: any;
        from: number;
        to: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    activeMedications: ActiveMedication[];
}

export default function History({ user, healthRecords, activeMedications }: HistoryProps) {
    const [showTooltip, setShowTooltip] = useState<number | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Use effect to hide tooltip if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if tooltip is shown and click target exists
            if (showTooltip && event.target) {
                const target = event.target as Node;

                // If tooltipRef exists and the clicked element is not inside the tooltip
                if (tooltipRef.current && !tooltipRef.current.contains(target)) {
                    // Also check if the click is not on the status badge that triggers the tooltip
                    const statusBadge = document.querySelector(`[data-tooltip-trigger="${showTooltip}"]`);
                    if (!statusBadge || !statusBadge.contains(target)) {
                        setShowTooltip(null);
                    }
                }
            }
        };

        // Only add event listener when tooltip is shown
        if (showTooltip) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup function
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showTooltip]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getTestResults = (record: HealthRecord) => {
        const results: string[] = [];

        // Jika ada analysis dari backend, gunakan itu
        if (record.analysis) {
            Object.entries(record.analysis).forEach(([category, tests]) => {
                tests.forEach((test: any) => {
                    if (test.has_value) {
                        results.push(`${test.parameter.parameter_name}: ${test.value} ${test.parameter.unit}`);
                    }
                });
            });
        } else {
            // Fallback ke logic lama
            if (record.sugar_fasting) results.push(`GDP: ${record.sugar_fasting} mg/dL`);
            if (record.sugar_after_meal) results.push(`GD2PP: ${record.sugar_after_meal} mg/dL`);
            if (record.sugar_random) results.push(`GDS: ${record.sugar_random} mg/dL`);
            if (record.cholesterol_total) results.push(`Kolesterol: ${record.cholesterol_total} mg/dL`);
            if (record.triglycerides) results.push(`Trigliserida: ${record.triglycerides} mg/dL`);
            if (record.hdl) results.push(`HDL: ${record.hdl} mg/dL`);
            if (record.ldl) results.push(`LDL: ${record.ldl} mg/dL`);
            if (record.uric_acid) results.push(`Asam Urat: ${record.uric_acid} mg/dL`);
        }

        return results;
    };

    // Update function untuk menggunakan dynamic status
    const getHealthStatus = (record: HealthRecord) => {
        // Jika ada overall_status dari backend, gunakan itu
        if (record.overall_status) {
            return {
                status: record.overall_status.status,
                color: `${record.overall_status.bgColor} ${record.overall_status.color}`,
            };
        }

        // Fallback ke logic lama
        const hasHighValues =
            (record.sugar_fasting && record.sugar_fasting > 100) ||
            (record.sugar_after_meal && record.sugar_after_meal > 140) ||
            (record.cholesterol_total && record.cholesterol_total > 200) ||
            (record.uric_acid && record.uric_acid > 7);

        if (hasHighValues) {
            return { status: 'Perlu Perhatian', color: 'bg-yellow-100 text-yellow-700' };
        }
        return { status: 'Normal', color: 'bg-green-100 text-green-700' };
    };

    const generateRecordNumber = (record: HealthRecord) => {
        const date = new Date(record.recorded_at);
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        return `LAB-${dateStr}-${record.id.toString().padStart(4, '0')}`;
    };

    const getStatusDetails = (record: HealthRecord) => {
        if (record.overall_status) {
            const status = record.overall_status;

            // Jika ada analysis, ambil parameter yang abnormal
            const abnormalParams: string[] = [];
            if (record.analysis) {
                Object.entries(record.analysis).forEach(([category, tests]) => {
                    tests.forEach((test: any) => {
                        if (test.has_value && test.status.status !== 'Normal' && test.status.status !== '-') {
                            abnormalParams.push(`${test.parameter.parameter_name}: ${test.value} ${test.parameter.unit} (${test.status.status})`);
                        }
                    });
                });
            }

            return {
                ...status,
                abnormalParams,
                icon: status.status === 'Semua Normal' ? CheckCircle :
                    status.status === 'Perlu Perhatian' ? AlertTriangle : Info
            };
        }

        return null;
    };

    return (
        <PwaMainLayout user={user}>
            <div className="min-h-screen">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Riwayat Pemeriksaan</h1>
                        <p className="mt-1 text-sm text-gray-600">Total: {healthRecords.total || 0} pemeriksaan</p>
                    </div>
                    <Link
                        href="/obat"
                        className="flex items-center space-x-1.5 rounded-full bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
                    >
                        <Pill className="h-4 w-4" />
                        <span>Obat Saya</span>
                    </Link>
                </div>

                {/* Active Medications Summary */}
                {activeMedications.length > 0 && (
                    <Link
                        href="/obat"
                        className="mb-6 block rounded-2xl bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
                    >
                        <div className="mb-2 flex items-center space-x-2">
                            <Pill className="h-4 w-4 text-teal-600" />
                            <h3 className="text-sm font-semibold text-gray-700">Obat yang Sedang Dikonsumsi</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {activeMedications.map((med) => (
                                <span
                                    key={med.id}
                                    className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700"
                                >
                                    {med.nama_obat} {med.dosis}
                                </span>
                            ))}
                        </div>
                    </Link>
                )}

                {/* Records List */}
                <div className="space-y-4">
                    {healthRecords.data.length > 0 ? (
                        healthRecords.data.map((record) => {
                            const testResults = getTestResults(record);
                            const healthStatus = getHealthStatus(record);
                            const statusDetails = getStatusDetails(record);
                            const recordNumber = generateRecordNumber(record);

                            return (
                                <div key={record.id} className="rounded-2xl bg-white p-6 shadow-sm">
                                    {/* Header with record number and status */}
                                    <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
                                        <div>
                                            <p className="mb-1 text-sm text-gray-600">No. Pemeriksaan</p>
                                            <p className="text-lg font-bold text-gray-800">{recordNumber}</p>
                                        </div>

                                        {/* Enhanced Status Badge with Tooltip */}
                                        <div className="relative">
                                            <div
                                                className={`
                                                    flex items-center space-x-2 rounded-full px-3 py-1 text-sm font-medium cursor-pointer
                                                    ${healthStatus.color}
                                                    ${statusDetails?.abnormalParams && statusDetails.abnormalParams.length > 0 ? 'hover:opacity-80' : ''}
                                                `}
                                                onClick={() => {
                                                    if (statusDetails?.abnormalParams && statusDetails.abnormalParams.length > 0) {
                                                        setShowTooltip(showTooltip === record.id ? null : record.id);
                                                    }
                                                }}
                                            >
                                                {statusDetails?.icon && (
                                                    <statusDetails.icon className="w-4 h-4" />
                                                )}
                                                <span className="font-semibold text-sm">{healthStatus.status}</span>
                                                {statusDetails?.abnormalParams && statusDetails.abnormalParams.length > 0 && (
                                                    <Info className="w-4 h-4 opacity-70" />
                                                )}
                                            </div>

                                            {/* Tooltip/Dropdown for abnormal parameters */}
                                            {showTooltip === record.id && statusDetails?.abnormalParams && statusDetails.abnormalParams.length > 0 && (
                                                <div
                                                    ref={tooltipRef}
                                                    className="absolute right-0 top-10 z-10 w-72 rounded-lg bg-white border border-gray-200 shadow-lg p-4">
                                                    <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100">
                                                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                                        <h4 className="font-semibold text-gray-800">Parameter yang Perlu Perhatian:</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {statusDetails.abnormalParams.map((param, index) => (
                                                            <div key={index} className="flex items-start space-x-2">
                                                                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                                                <p className="text-sm text-gray-700">{param}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-3 pt-2 border-t border-gray-100">
                                                        <p className="text-xs text-gray-500">
                                                            Konsultasikan dengan dokter untuk penanganan lebih lanjut
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Test Results and Date */}
                                    <div className="mb-6 flex flex-col items-start justify-between">
                                        <div className="space-between flex w-full flex-row items-center">
                                            <div className="flex items-center justify-center rounded-full bg-blue-100">
                                                <Calendar className="m-2 h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="space-between flex w-full flex-row">
                                                <div className="ml-2 flex w-full flex-col">
                                                    <h3 className="text-md font-bold text-gray-800">Hasil Pemeriksaan Lab</h3>

                                                    <p className="font-bold text-gray-800">{formatDate(record.recorded_at)}</p>
                                                </div>

                                                <div className="">
                                                    {record.lab_document && (
                                                        <div className="flex items-center">
                                                            {record.type_document === 'image' ? (
                                                                <Image className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <FileText className="h-4 w-4 text-red-600" />
                                                            )}
                                                            <span className="ml-1 text-xs text-gray-500">
                                                                {record.type_document === 'image' ? 'Gambar' : 'PDF'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-col">
                                            <div className="">
                                                <div className="space-y-1 text-sm">
                                                    {testResults.length > 0 ? (
                                                        testResults.slice(0, 3).map((result, index) => (
                                                            <p key={index} className="text-sm text-gray-600">
                                                                • {result}
                                                            </p>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic">Tidak ada data pemeriksaan</p>
                                                    )}
                                                    {testResults.length > 3 && (
                                                        <p className="text-sm text-gray-500">+ {testResults.length - 3} pemeriksaan lainnya</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex space-x-3">
                                        <Link
                                            href={route('examinations.show', record.id)}
                                            className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-secondary py-3 font-medium text-white transition-colors hover:bg-primary"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>Lihat Detail</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-2xl bg-white p-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-800">Belum Ada Riwayat Pemeriksaan</h3>
                            <p className="mb-4 text-gray-600">Mulai tambahkan hasil pemeriksaan lab Anda</p>
                            <Link
                                href="/examinations/add"
                                className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700"
                            >
                                Tambah Pemeriksaan
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {healthRecords.meta?.last_page > 1 && (
                    <div className="mt-6 flex justify-center space-x-2">
                        {healthRecords.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-2 text-sm ${link.active ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* Spacer */}
                <div className="h-24"></div>
            </div>
        </PwaMainLayout>
    );
}
