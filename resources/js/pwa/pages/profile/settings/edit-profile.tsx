import { SharedData } from '@/admin/types';
import HeadingSmall from '@/pwa/components/heading-small';
import InputError from '@/pwa/components/input-error';
import { Toaster } from '@/pwa/components/sonner';
import { Button } from '@/pwa/components/ui/button';
import { Calendar } from '@/pwa/components/ui/calendar';
import { Input } from '@/pwa/components/ui/input';
import { Label } from '@/pwa/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/pwa/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pwa/components/ui/select';
import { Textarea } from '@/pwa/components/ui/textarea';
import { Dialog, Transition } from '@headlessui/react';
import { router, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Camera, Check, ChevronDownIcon, RotateCcw } from 'lucide-react';
import { FormEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type ProfileForm = {
    name: string;
    email: string;
    whatsapp_number: string;
    birth_place: string;
    birth_date: string;
    gender: string;
    address: string;
    avatar?: File | null;
    _method: 'patch';
};

// --- Komponen ImageCropper ---
// --- Komponen ImageCropper yang sudah diperbaiki ---
interface ImageCropperProps {
    src: string;
    onCrop: (croppedFile: File) => void;
    onCancel: () => void;
    isOpen: boolean;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ src, onCrop, onCancel, isOpen }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

    const calculateImageSizeAndPosition = useCallback(() => {
        if (!imageRef.current || !containerRef.current) return;

        const image = imageRef.current;
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const imageAspectRatio = image.naturalWidth / image.naturalHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        let displayWidth, displayHeight;

        // Fit image dalam container dengan mempertahankan aspect ratio
        if (containerAspectRatio > imageAspectRatio) {
            // Container lebih lebar, fit berdasarkan height
            displayHeight = containerHeight;
            displayWidth = displayHeight * imageAspectRatio;
        } else {
            // Container lebih tinggi, fit berdasarkan width
            displayWidth = containerWidth;
            displayHeight = displayWidth / imageAspectRatio;
        }

        // Hitung offset untuk center image
        const offsetX = (containerWidth - displayWidth) / 2;
        const offsetY = (containerHeight - displayHeight) / 2;

        setImageSize({ width: displayWidth, height: displayHeight });
        setImageOffset({ x: offsetX, y: offsetY });

        return { displayWidth, displayHeight, offsetX, offsetY };
    }, []);

    const initializeCrop = useCallback(() => {
        const dimensions = calculateImageSizeAndPosition();
        if (!dimensions) return;

        const { displayWidth, displayHeight, offsetX, offsetY } = dimensions;

        // Set crop area di center dengan ukuran yang sesuai
        const cropSize = Math.min(displayWidth, displayHeight) * 0.6;
        const cropX = offsetX + (displayWidth - cropSize) / 2;
        const cropY = offsetY + (displayHeight - cropSize) / 2;

        setCrop({
            x: cropX,
            y: cropY,
            width: cropSize,
            height: cropSize,
        });
        setScale(1);
    }, [calculateImageSizeAndPosition]);

    useEffect(() => {
        if (isOpen) {
            const image = imageRef.current;
            if (image && image.complete) {
                setTimeout(initializeCrop, 100); // Small delay to ensure DOM is ready
            }
        }
    }, [isOpen, initializeCrop]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || !imageRef.current) return;

            const scaledWidth = imageSize.width * scale;
            const scaledHeight = imageSize.height * scale;

            // Hitung posisi image yang sudah di-scale
            const scaledImageX = imageOffset.x - (scaledWidth - imageSize.width) / 2;
            const scaledImageY = imageOffset.y - (scaledHeight - imageSize.height) / 2;

            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            // Constrain crop area agar tidak keluar dari gambar
            const minX = scaledImageX;
            const maxX = scaledImageX + scaledWidth - crop.width;
            const minY = scaledImageY;
            const maxY = scaledImageY + scaledHeight - crop.height;

            const constrainedX = Math.max(minX, Math.min(newX, maxX));
            const constrainedY = Math.max(minY, Math.min(newY, maxY));

            setCrop((prev) => ({ ...prev, x: constrainedX, y: constrainedY }));
        },
        [isDragging, dragStart, crop.width, crop.height, scale, imageSize, imageOffset],
    );

    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const handleScaleChange = (newScale: number) => {
        setScale(newScale);

        // Recalculate constraints untuk crop area saat zoom berubah
        const scaledWidth = imageSize.width * newScale;
        const scaledHeight = imageSize.height * newScale;

        const scaledImageX = imageOffset.x - (scaledWidth - imageSize.width) / 2;
        const scaledImageY = imageOffset.y - (scaledHeight - imageSize.height) / 2;

        // Adjust crop position jika keluar dari bounds
        const minX = scaledImageX;
        const maxX = scaledImageX + scaledWidth - crop.width;
        const minY = scaledImageY;
        const maxY = scaledImageY + scaledHeight - crop.height;

        setCrop((prev) => ({
            ...prev,
            x: Math.max(minX, Math.min(prev.x, maxX)),
            y: Math.max(minY, Math.min(prev.y, maxY)),
        }));
    };

    const handleCrop = () => {
        if (!imageRef.current || !canvasRef.current) return;
        const image = imageRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const outputSize = 300;
        canvas.width = outputSize;
        canvas.height = outputSize;

        // Hitung scaling factor dari display size ke natural size
        const scaleToNatural = image.naturalWidth / (imageSize.width * scale);

        // Hitung posisi crop relatif terhadap gambar yang sudah di-scale
        const scaledImageX = imageOffset.x - (imageSize.width * scale - imageSize.width) / 2;
        const scaledImageY = imageOffset.y - (imageSize.height * scale - imageSize.height) / 2;

        const cropRelativeX = (crop.x - scaledImageX) * scaleToNatural;
        const cropRelativeY = (crop.y - scaledImageY) * scaleToNatural;
        const cropSizeNatural = crop.width * scaleToNatural;

        ctx.drawImage(image, cropRelativeX, cropRelativeY, cropSizeNatural, cropSizeNatural, 0, 0, outputSize, outputSize);

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    onCrop(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
                }
            },
            'image/jpeg',
            0.9,
        );
    };

    return (
        <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto w-full max-w-lg rounded-lg bg-white p-4 shadow-xl">
                    <div
                        ref={containerRef}
                        className="relative mb-4 flex h-80 w-full items-center justify-center overflow-hidden rounded bg-gray-200"
                    >
                        <img
                            ref={imageRef}
                            src={src}
                            alt="Crop preview"
                            onLoad={() => {
                                calculateImageSizeAndPosition();
                                setTimeout(initializeCrop, 100);
                            }}
                            className="absolute"
                            style={{
                                transform: `scale(${scale})`,
                                transformOrigin: 'center center',
                                width: `${imageSize.width}px`,
                                height: `${imageSize.height}px`,
                                left: `${imageOffset.x}px`,
                                top: `${imageOffset.y}px`,
                            }}
                        />
                        <div
                            className="absolute cursor-move border-2 border-dashed border-white"
                            style={{
                                left: crop.x,
                                top: crop.y,
                                width: crop.width,
                                height: crop.height,
                                boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                            }}
                            onMouseDown={handleMouseDown}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="scale">Zoom</Label>
                        <input
                            id="scale"
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            value={scale}
                            onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={initializeCrop} className="flex items-center gap-2">
                            <RotateCcw size={16} /> Reset
                        </Button>
                        <div className="flex gap-2">
                            <Button type="button" variant="ghost" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCrop}
                                className="flex items-center gap-2 bg-gradient-to-br from-teal-400 to-teal-600 text-white"
                            >
                                <Check size={16} /> Crop & Save
                            </Button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

const parseValidDate = (dateInput: string | Date | null | undefined): Date | undefined => {
    if (!dateInput) return undefined;

    const date = new Date(dateInput);
    // Periksa apakah objek Date yang dihasilkan adalah tanggal yang valid
    if (date instanceof Date && !isNaN(date.getTime())) {
        return date;
    }

    return undefined;
};

// --- Komponen Utama EditProfile ---
export default function EditProfile() {
    const [open, setOpen] = useState(false);
    const { auth } = usePage<SharedData>().props;

    const [date, setDate] = useState<Date | undefined>(parseValidDate(auth.user.birth_date));
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: auth.user.name ?? '',
        email: auth.user.email ?? '',
        whatsapp_number: auth.user.whatsapp_number ?? '',
        birth_place: auth.user.birth_place ?? '',
        birth_date: auth.user.birth_date ?? '',
        gender: auth.user.gender ?? 'male',
        address: auth.user.address ?? '',
        avatar: null,
        _method: 'patch',
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/'))
                return toast.error('Hanya file gambar yang diizinkan', {
                    style: {
                        background: '#EF4444',
                        color: '#ffffff',
                        border: '1px solid #e5e7eb',
                    },
                    className: 'bg-white text-black border-gray-200',
                });
            if (file.size > 2 * 1024 * 1024)
                return toast.error('Ukuran file maksimal 2MB', {
                    style: {
                        background: '#EF4444',
                        color: '#ffffff',
                        border: '1px solid #e5e7eb',
                    },
                    className: 'bg-white text-black border-gray-200',
                });

            const originalUrl = URL.createObjectURL(file);
            setOriginalImageSrc(originalUrl);
            setShowCropper(true);
        }
    };

    const handleCropComplete = (croppedFile: File) => {
        const previewUrl = URL.createObjectURL(croppedFile);
        setPreviewImage(previewUrl);
        setData('avatar', croppedFile);
        setShowCropper(false);
        if (originalImageSrc) URL.revokeObjectURL(originalImageSrc);
        setOriginalImageSrc(null);
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        if (originalImageSrc) {
            URL.revokeObjectURL(originalImageSrc);
            setOriginalImageSrc(null);
        }
    };

    useEffect(() => {
        return () => {
            if (previewImage) URL.revokeObjectURL(previewImage);
            if (originalImageSrc) URL.revokeObjectURL(originalImageSrc);
        };
    }, [previewImage, originalImageSrc]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.settings.update-profile'), {
            preserveScroll: true,
            onSuccess: () => {
                if (previewImage) {
                    URL.revokeObjectURL(previewImage);
                    setPreviewImage(null);
                }
                toast.success('Profile berhasil diperbarui', {
                    style: {
                        background: '#22C55E',
                        color: '#ffffff',
                        border: '1px solid #e5e7eb',
                    },
                    className: 'bg-white text-black border-gray-200',
                });
            },
        });
    };

    return (
        <div>
            <div className="min-h-screen bg-gray-50 p-4">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <button onClick={() => router.visit(route('profile'))} className="text-gray-800">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>
                    <div className="w-6"></div>
                </div>

                {/* Avatar Section */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <input type="file" accept="image/*" className="hidden" id="avatar" onChange={handleFileSelect} />
                        <div
                            onClick={() => document.getElementById('avatar')?.click()}
                            className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-400 shadow-lg transition-shadow hover:shadow-xl"
                        >
                            {previewImage ? (
                                <img src={previewImage} alt="Avatar Preview" className="h-full w-full object-cover" />
                            ) : auth.user.avatar ? (
                                <img src={`/storage/${auth.user.avatar}`} alt="Current Avatar" className="h-full w-full object-cover" />
                            ) : (
                                <Camera size={24} className="text-gray-600" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
                                <Camera size={20} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cropper Modal */}
                {originalImageSrc && (
                    <ImageCropper src={originalImageSrc} onCrop={handleCropComplete} onCancel={handleCropCancel} isOpen={showCropper} />
                )}

                {/* Form Section */}
                <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
                    <HeadingSmall title="Informasi Profil" description="Perbarui informasi Anda" />
                    <form onSubmit={submit} className="mt-4 space-y-6 text-black">
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Nama lengkap"
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="Alamat email"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* WhatsApp */}
                        <div className="grid gap-2">
                            <Label htmlFor="whatsapp_number">Nomor WhatsApp</Label>
                            <Input
                                id="whatsapp_number"
                                value={data.whatsapp_number}
                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                                required
                                placeholder="+62"
                            />
                            <InputError message={errors.whatsapp_number} />
                        </div>

                        {/* Birth Place */}
                        <div className="grid gap-2">
                            <Label htmlFor="birth_place">Tempat Lahir</Label>
                            <Input
                                id="birth_place"
                                value={data.birth_place}
                                onChange={(e) => setData('birth_place', e.target.value)}
                                required
                                placeholder="Kota kelahiran"
                            />
                            <InputError message={errors.birth_place} />
                        </div>

                        {/* Birth Date */}
                        <div className="grid gap-2">
                            <Label htmlFor="birth_date">Birth Date</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild className="w-full">
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className="w-full justify-between bg-white font-normal hover:bg-white hover:text-black"
                                    >
                                        {date ? format(new Date(date), 'dd/MM/yyyy') : format(new Date(auth.user.birth_date), 'dd/MM/yyyy')}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[var(--radix-popover-trigger-width)] max-w-none overflow-hidden border-gray-50 bg-white p-0 text-black"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setDate(date);
                                            setData('birth_date', date ? format(date, 'yyyy-MM-dd') : '');
                                            setOpen(false);
                                        }}
                                        className="[--cell-size:--spacing(10)]"
                                    />
                                </PopoverContent>
                            </Popover>
                            <InputError className="mt-2" message={errors.birth_date} />
                        </div>

                        {/* Gender */}
                        <div className="grid gap-2">
                            <Label htmlFor="gender">Jenis Kelamin</Label>
                            <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Laki-laki</SelectItem>
                                    <SelectItem value="female">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.gender} />
                        </div>

                        {/* Address */}
                        <div className="grid gap-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Textarea
                                placeholder="Alamat lengkap Anda"
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                            <InputError message={errors.address} />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center gap-4">
                            <Button disabled={processing} className="bg-gradient-to-br from-teal-400 to-teal-600 text-white">
                                Save
                            </Button>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
