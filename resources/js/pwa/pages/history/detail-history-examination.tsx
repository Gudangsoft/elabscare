import PwaMainLayout from '@/pwa/layouts/pwa-main-layout';
import { UserType } from '@/pwa/types/userType';
import { Link } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle, Download, Edit, FileText, Image } from 'lucide-react';

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
}

interface DetailHistoryProps {
    user: UserType;
    healthRecord: HealthRecord;
    analysis: Record<string, any[]>;
    overallStatus: {
        status: string;
        color: string;
        bgColor: string;
    };
}

export default function DetailHistoryExamination({ user, healthRecord, analysis, overallStatus }: DetailHistoryProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const generateRecordNumber = (record: HealthRecord) => {
        const date = new Date(record.recorded_at);
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        return `LAB-${dateStr}-${record.id.toString().padStart(4, '0')}`;
    };

    return (
        <PwaMainLayout user={user}>
            <div className="min-h-screen pb-24">
                {/* Header */}
                <div className="mb-6">
                    <div className="mb-4 flex items-center space-x-3">
                        <button
                            onClick={() => window.history.back()}
                            className="rounded-lg bg-white p-2 shadow-sm transition-colors hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Detail Pemeriksaan</h1>
                            <p className="text-sm text-gray-600">{generateRecordNumber(healthRecord)}</p>
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{formatDate(healthRecord.recorded_at)}</h2>
                                <p className="text-sm text-gray-600">Tanggal Pemeriksaan</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div
                                className={`inline-flex items-center space-x-2 rounded-full px-4 py-1 text-sm font-medium ${overallStatus.bgColor} ${overallStatus.color}`}
                            >
                                {overallStatus.status === 'Semua Normal' ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5" />
                                )}
                                <span>{overallStatus.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Document Section */}
                    {healthRecord.lab_document && (
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {healthRecord.type_document === 'image' ? (
                                        <Image className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <FileText className="h-5 w-5 text-red-600" />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-800">Dokumen Lab</p>
                                        <p className="text-sm text-gray-600">{healthRecord.type_document === 'image' ? 'Gambar' : 'PDF'} tersimpan</p>
                                    </div>
                                </div>
                                <a
                                    href={`/storage/${healthRecord.lab_document}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    <Download className="h-4 w-4" />
                                    <span className="text-sm">Lihat</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dynamic Examination Results */}
                {Object.entries(analysis).map(([categoryName, tests], examIndex) => (
                    <div key={examIndex} className="mb-4 rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="mb-4 border-b pb-2 text-lg font-bold text-gray-800">{categoryName}</h3>

                        <div className="space-y-4">
                            {tests.map((test, testIndex) => (
                                <div key={testIndex} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{test.parameter.parameter_name}</p>
                                        <p className="text-sm text-gray-600">
                                            Normal: {test.parameter.normal_range_text} {test.parameter.unit}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-800">{test.value ? `${test.value} ${test.parameter.unit}` : '-'}</p>
                                        <div
                                            className={`inline-block rounded px-2 py-1 text-xs font-medium ${test.status.bgColor} ${test.status.color}`}
                                        >
                                            {test.status.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Action Buttons */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="space-y-3">
                        <Link
                            href={route('examinations.edit', healthRecord.id)}
                            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-teal-600 py-3 font-medium text-white transition-colors hover:bg-teal-700"
                        >
                            <Edit className="h-4 w-4" />
                            <span>Edit Pemeriksaan</span>
                        </Link>

                        <Link
                            href="/history"
                            className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            Kembali ke Riwayat
                        </Link>
                    </div>
                </div>
            </div>
        </PwaMainLayout>
    );
}
