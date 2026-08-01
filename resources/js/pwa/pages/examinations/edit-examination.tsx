import PwaMainLayout from '@/pwa/layouts/pwa-main-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, Upload, X, FileText, Image, ArrowLeft, Edit } from 'lucide-react';
import { FormEventHandler, useRef, useState, useEffect } from 'react';

import InputError from '@/pwa/components/input-error';
import { Button } from '@/pwa/components/ui/button';
import { Input } from '@/pwa/components/ui/input';
import { Label } from '@/pwa/components/ui/label';
import { UserType } from '@/pwa/types/userType';

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

interface EditExaminationProps {
    user: UserType;
    healthRecord: HealthRecord;
}

type EditExaminationForm = {
    sugar_fasting: number;
    sugar_after_meal: number;
    sugar_random: number;
    cholesterol_total: number;
    triglycerides: number;
    hdl: number;
    ldl: number;
    uric_acid: number;
    recorded_at: string;
    lab_document: File | null;
};

const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

export default function EditExamination({ user, healthRecord }: EditExaminationProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileInfo, setFileInfo] = useState<{ name: string; size: string; type: string } | null>(null);
    const [currentDocument, setCurrentDocument] = useState<{ path: string; type: string } | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<EditExaminationForm>({
        sugar_fasting: healthRecord.sugar_fasting || 0,
        sugar_after_meal: healthRecord.sugar_after_meal || 0,
        sugar_random: healthRecord.sugar_random || 0,
        cholesterol_total: healthRecord.cholesterol_total || 0,
        triglycerides: healthRecord.triglycerides || 0,
        hdl: healthRecord.hdl || 0,
        ldl: healthRecord.ldl || 0,
        uric_acid: healthRecord.uric_acid || 0,
        recorded_at: formatDateForInput(healthRecord.recorded_at),
        lab_document: null,
    });

    // Set current document info on mount
    useEffect(() => {
        if (healthRecord.lab_document) {
            setCurrentDocument({
                path: healthRecord.lab_document,
                type: healthRecord.type_document || 'unknown'
            });
        }
    }, [healthRecord]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const generateRecordNumber = (record: HealthRecord) => {
        const date = new Date(record.recorded_at);
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        return `LAB-${dateStr}-${record.id.toString().padStart(4, '0')}`;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('Hanya file JPG, PNG, atau PDF yang diizinkan');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB');
                return;
            }

            setData('lab_document', file);

            // Set file info
            setFileInfo({
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type
            });

            // Clear current document
            setCurrentDocument(null);

            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviewUrl(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const removeFile = () => {
        setData('lab_document', null);
        setPreviewUrl(null);
        setFileInfo(null);
        setCurrentDocument(healthRecord.lab_document ? {
            path: healthRecord.lab_document,
            type: healthRecord.type_document || 'unknown'
        } : null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeCurrentDocument = () => {
        setCurrentDocument(null);
        // You might want to set a flag to indicate document should be deleted
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Create FormData untuk handle file upload
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            const value = data[key as keyof EditExaminationForm];
            if (value !== null && value !== undefined) {
                if (key === 'lab_document' && value instanceof File) {
                    formData.append(key, value);
                } else if (key !== 'lab_document') {
                    formData.append(key, value.toString());
                }
            }
        });

        // Use PUT method with _method override
        formData.append('_method', 'PUT');

        post(route('examinations.update', healthRecord.id), {
            onSuccess: () => {
                // Redirect to detail page or history
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            }
        });
    };

    return (
        <PwaMainLayout user={user}>
            <div className="min-h-screen bg-white pb-24 text-gray-800">
                <Head title="Edit Examination" />

                <div className="bg-white flex flex-col rounded-2xl p-6 shadow-sm">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <Link
                                href={route('examinations.show', healthRecord.id)}
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-teal-600">Edit Hasil Pemeriksaan</h1>
                                <p className="text-gray-600 text-sm">
                                    {generateRecordNumber(healthRecord)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <InputError className='mb-2' message={(errors as Record<string, string>)?.general} />

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        {/* Date */}
                        <div className="grid gap-2">
                            <Label htmlFor="recorded_at">Tanggal Pemeriksaan</Label>
                            <Input
                                id="recorded_at"
                                type="date"
                                required
                                value={data.recorded_at}
                                onChange={(e) => setData('recorded_at', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.recorded_at} />
                        </div>

                        {/* Sugar Tests */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Pemeriksaan Gula Darah</h2>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="sugar_fasting">Gula Darah Puasa (mg/dL)</Label>
                                    <Input
                                        id="sugar_fasting"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.sugar_fasting || ''}
                                        onChange={(e) => setData('sugar_fasting', Number(e.target.value))}
                                        disabled={processing}
                                        placeholder="70-100"
                                    />
                                    <InputError message={errors.sugar_fasting} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="sugar_after_meal">Gula Darah 2 Jam PP (mg/dL)</Label>
                                    <Input
                                        id="sugar_after_meal"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.sugar_after_meal || ''}
                                        onChange={(e) => setData('sugar_after_meal', Number(e.target.value))}
                                        disabled={processing}
                                        placeholder="< 140"
                                    />
                                    <InputError message={errors.sugar_after_meal} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="sugar_random">Gula Darah Sewaktu (mg/dL)</Label>
                                    <Input
                                        id="sugar_random"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.sugar_random || ''}
                                        onChange={(e) => setData('sugar_random', Number(e.target.value))}
                                        disabled={processing}
                                        placeholder="< 200"
                                    />
                                    <InputError message={errors.sugar_random} />
                                </div>
                            </div>
                        </div>

                        {/* Cholesterol Tests */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Pemeriksaan Kolesterol</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="cholesterol_total">Kolesterol Total (mg/dL)</Label>
                                    <Input
                                        id="cholesterol_total"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.cholesterol_total || ''}
                                        onChange={(e) => setData('cholesterol_total', Number(e.target.value))}
                                        disabled={processing}
                                        placeholder="< 200"
                                    />
                                    <InputError message={errors.cholesterol_total} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="triglycerides">Trigliserida (mg/dL)</Label>
                                    <Input
                                        id="triglycerides"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.triglycerides || ''}
                                        onChange={(e) => setData('triglycerides', Number(e.target.value))}
                                        disabled={processing}
                                        placeholder="< 150"
                                    />
                                    <InputError message={errors.triglycerides} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="hdl">HDL Kolesterol (mg/dL)</Label>
                                    <Input
                                        id="hdl"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.hdl || ''}
                                        onChange={(e) => setData('hdl', Number(e.target.value))}
                                        disabled={processing}
                                        placeholder="> 40 (pria), > 50 (wanita)"
                                    />
                                    <InputError message={errors.hdl} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="ldl">LDL Kolesterol (mg/dL)</Label>
                                    <Input
                                        id="ldl"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.ldl || ''}
                                        onChange={(e) => setData('ldl', Number(e.target.value))}
                                        disabled={processing}
                                        placeholder="< 100"
                                    />
                                    <InputError message={errors.ldl} />
                                </div>
                            </div>
                        </div>

                        {/* Uric Acid */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Pemeriksaan Asam Urat</h2>

                            <div className="grid gap-2">
                                <Label htmlFor="uric_acid">Asam Urat (mg/dL)</Label>
                                <Input
                                    id="uric_acid"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.uric_acid || ''}
                                    onChange={(e) => setData('uric_acid', Number(e.target.value))}
                                    disabled={processing}
                                    placeholder="3.5-7.2 (pria), 2.6-6.0 (wanita)"
                                />
                                <InputError message={errors.uric_acid} />
                            </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Upload Dokumen Lab</h2>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Foto/Scan Hasil Lab (Opsional)</Label>
                                    <p className="text-sm text-gray-500">Format: JPG, PNG, PDF (Max 5MB)</p>

                                    {/* Current Document Display */}
                                    {currentDocument && !data.lab_document && (
                                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    {currentDocument.type === 'image' ? (
                                                        <Image className="w-6 h-6 text-blue-500" />
                                                    ) : (
                                                        <FileText className="w-6 h-6 text-red-500" />
                                                    )}
                                                    <div className="w-full">
                                                        <p className="font-medium text-gray-800 break-all">Dokumen Saat Ini</p>
                                                        <p className="text-sm text-gray-500">
                                                            {currentDocument.type === 'image' ? 'Gambar' : 'PDF'} tersimpan
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <a
                                                        href={`/storage/${currentDocument.path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:text-blue-700"
                                                    >
                                                        Lihat
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="text-sm text-teal-600 hover:text-teal-700"
                                                    >
                                                        Ganti
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* New File Upload */}
                                    {!currentDocument || data.lab_document ? (
                                        <>
                                            {!data.lab_document ? (
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors"
                                                >
                                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-gray-600 font-medium">Klik untuk upload file</p>
                                                    <p className="text-sm text-gray-400">atau drag & drop file di sini</p>
                                                </div>
                                            ) : (
                                                <div className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            {fileInfo?.type.startsWith('image/') ? (
                                                                <Image className="w-6 h-6 text-blue-500" />
                                                            ) : (
                                                                <FileText className="w-6 h-6 text-red-500" />
                                                            )}
                                                            <div className='w-full'>
                                                                <p className="font-medium text-gray-800 break-all">{fileInfo?.name}</p>
                                                                <p className="text-sm text-gray-500">{fileInfo?.size}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={removeFile}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    {/* Image Preview */}
                                                    {previewUrl && (
                                                        <div className="mt-3">
                                                            <img
                                                                src={previewUrl}
                                                                alt="Preview"
                                                                className="w-full max-w-sm h-auto rounded-lg border border-gray-200"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Change File Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium"
                                                    >
                                                        Ganti File
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : null}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={processing}
                                    />
                                    <InputError message={errors.lab_document} />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col justify-between items-center gap-3 mt-6 ">
                            <Button type="submit" className="flex-1 py-3 w-full bg-secondary text-white" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Update Hasil Pemeriksaan
                            </Button>

                            <Link
                                href={route('examinations.show', healthRecord.id)}
                                className="flex-1 w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </PwaMainLayout>
    );
}