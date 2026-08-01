import PwaMainLayout from '@/pwa/layouts/pwa-main-layout';
import { UserType } from '@/pwa/types/userType';
import { Activity, Bell, ChevronDown, Home, PieChart, Pill, Plus, User as UserIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface GuideSection {
    icon: ReactNode;
    title: string;
    description: string;
    steps: string[];
}

interface UserGuideProps {
    user: UserType;
}

const sections: GuideSection[] = [
    {
        icon: <Home className="h-5 w-5" />,
        title: 'Beranda',
        description: 'Halaman utama saat Anda membuka aplikasi.',
        steps: [
            'Lihat ringkasan status kesehatan terbaru (gula darah, kolesterol, asam urat).',
            'Pilih tanggal di kalender untuk melihat data pemeriksaan pada hari tersebut.',
            'Gunakan tombol pintasan "Tambah Hasil", "Lihat Riwayat", dan "Obat Saya" untuk akses cepat.',
        ],
    },
    {
        icon: <Plus className="h-5 w-5" />,
        title: 'Tambah Pemeriksaan',
        description: 'Mencatat hasil pemeriksaan laboratorium terbaru Anda.',
        steps: [
            'Tekan tombol "+" di navigasi bawah.',
            'Isi nilai hasil lab yang Anda miliki (tidak perlu diisi semua).',
            'Unggah foto/dokumen hasil lab jika ada.',
            'Simpan — hasil akan langsung dianalisis dan muncul di Riwayat & Tren.',
        ],
    },
    {
        icon: <PieChart className="h-5 w-5" />,
        title: 'Tren Kesehatan',
        description: 'Memantau perkembangan hasil pemeriksaan dari waktu ke waktu.',
        steps: [
            'Pilih rentang periode: 1 Bulan, 3 Bulan, 6 Bulan, atau 1 Tahun.',
            'Aktifkan/nonaktifkan parameter yang ingin ditampilkan di grafik.',
            'Lihat kartu "Riwayat Obat" untuk membandingkan periode konsumsi obat dengan tren hasil pemeriksaan.',
            'Kalender aktivitas menunjukkan hari-hari Anda melakukan pemeriksaan beserta statusnya.',
        ],
    },
    {
        icon: <Activity className="h-5 w-5" />,
        title: 'Riwayat Pemeriksaan',
        description: 'Daftar lengkap seluruh pemeriksaan yang pernah Anda catat.',
        steps: [
            'Lihat status tiap pemeriksaan (Normal / Perlu Perhatian) beserta parameter yang tidak normal.',
            'Kartu "Obat yang Sedang Dikonsumsi" di bagian atas menampilkan obat aktif Anda saat ini.',
            'Tekan "Lihat Detail" pada salah satu pemeriksaan untuk melihat rincian lengkapnya.',
        ],
    },
    {
        icon: <Pill className="h-5 w-5" />,
        title: 'Obat Saya',
        description: 'Mencatat obat yang sedang atau pernah Anda konsumsi.',
        steps: [
            'Tekan tombol "+" di halaman Obat Saya.',
            'Pilih Golongan → Nama Obat → Dosis → Aturan Pakai secara berurutan (pilihan menyesuaikan otomatis).',
            'Pilih Status Terapi: Aktif/Rutin, Dosis Diubah, atau Dihentikan.',
            'Isi Tanggal Mulai (dan Tanggal Selesai bila sudah berhenti).',
            'Tekan "+ Tambah Obat Lain" bila mengonsumsi lebih dari satu obat sekaligus, lalu Simpan.',
        ],
    },
    {
        icon: <Bell className="h-5 w-5" />,
        title: 'Notifikasi',
        description: 'Pengingat dan pemberitahuan dari sistem.',
        steps: [
            'Tekan ikon lonceng di pojok kanan atas untuk melihat semua notifikasi.',
            'Sistem otomatis mengirim pengingat setiap hari untuk obat yang berstatus Aktif/Rutin.',
            'Tekan sebuah notifikasi untuk menandainya sudah dibaca, atau gunakan "Tandai Semua".',
        ],
    },
    {
        icon: <UserIcon className="h-5 w-5" />,
        title: 'Profil',
        description: 'Kelola data diri dan keamanan akun Anda.',
        steps: [
            'Tekan foto profil di kanan atas untuk membuka menu akun.',
            'Ubah data diri atau kata sandi lewat menu Profil.',
            'Admin klinik dapat mengakses Dashboard Admin dari menu yang sama.',
        ],
    },
];

export default function UserGuide({ user }: UserGuideProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <PwaMainLayout user={user}>
            <div className="min-h-screen">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Panduan Pengguna</h1>
                    <p className="mt-1 text-sm text-gray-600">Pelajari cara menggunakan setiap fitur eLabCare</p>
                </div>

                <div className="space-y-3">
                    {sections.map((section, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div key={section.title} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="flex w-full items-center justify-between p-4 text-left"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                                            {section.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{section.title}</h3>
                                            <p className="text-xs text-gray-500">{section.description}</p>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="border-t border-gray-100 px-4 pb-4">
                                        <ol className="mt-3 space-y-2">
                                            {section.steps.map((step, stepIndex) => (
                                                <li key={stepIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                                                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                                                        {stepIndex + 1}
                                                    </span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="h-24"></div>
            </div>
        </PwaMainLayout>
    );
}
