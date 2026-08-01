import PwaMainLayout from '@/pwa/layouts/pwa-main-layout';
import { UserType } from '@/pwa/types/userType';
import { router } from '@inertiajs/react';
import { Pencil, Pill, Plus, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface DosisOption {
    id: number;
    dosis: string;
}

interface FrekuensiOption {
    id: number;
    frekuensi: string;
}

interface ObatOption {
    id: number;
    nama_obat: string;
    sub_golongan: string | null;
    dosis: DosisOption[];
    frekuensi: FrekuensiOption[];
}

interface GolonganOption {
    id: number;
    nama: string;
    obat: ObatOption[];
}

interface TerapiRecord {
    id: number;
    obat: {
        id: number;
        nama_obat: string;
        golongan: { id: number; nama: string } | null;
    };
    dosis: string;
    frekuensi: string;
    status: 'aktif' | 'dosis_diubah' | 'dihentikan';
    tanggal_mulai: string;
    tanggal_selesai: string | null;
    catatan: string | null;
}

interface ObatPageProps {
    user: UserType;
    terapi: TerapiRecord[];
    masterObat: GolonganOption[];
}

interface TerapiRow {
    key: number;
    golongan_id: number | '';
    obat_id: number | '';
    dosis: string;
    frekuensi: string;
    frekuensiLainnya: boolean;
    status: 'aktif' | 'dosis_diubah' | 'dihentikan';
    tanggal_mulai: string;
    tanggal_selesai: string;
}

const statusLabel: Record<string, string> = {
    aktif: 'Aktif / Rutin',
    dosis_diubah: 'Dosis Diubah',
    dihentikan: 'Dihentikan',
};

const statusColor: Record<string, string> = {
    aktif: 'bg-green-100 text-green-700',
    dosis_diubah: 'bg-yellow-100 text-yellow-700',
    dihentikan: 'bg-gray-200 text-gray-600',
};

const createEmptyRow = (key: number): TerapiRow => ({
    key,
    golongan_id: '',
    obat_id: '',
    dosis: '',
    frekuensi: '',
    frekuensiLainnya: false,
    status: 'aktif',
    tanggal_mulai: '',
    tanggal_selesai: '',
});

const inputClass = 'w-full rounded-xl border border-gray-200 py-2.5 px-3 text-sm outline-none focus:border-teal-500';

const getTodayDateString = () => new Date().toISOString().slice(0, 10);

export default function ObatPage({ user, terapi, masterObat }: ObatPageProps) {
    const rowKeyRef = useRef(1);
    const [showForm, setShowForm] = useState(terapi.length === 0);
    const [rows, setRows] = useState<TerapiRow[]>([createEmptyRow(0)]);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        dosis: '',
        frekuensi: '',
        status: 'aktif',
        tanggal_mulai: '',
        tanggal_selesai: '',
        catatan: '',
    });
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const getObatList = (golonganId: number | ''): ObatOption[] => {
        if (!golonganId) return [];
        return masterObat.find((g) => g.id === golonganId)?.obat || [];
    };

    const getObat = (golonganId: number | '', obatId: number | ''): ObatOption | undefined => {
        return getObatList(golonganId).find((o) => o.id === obatId);
    };

    const updateRow = (key: number, changes: Partial<TerapiRow>) => {
        setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...changes } : row)));
    };

    const handleGolonganChange = (key: number, golonganId: number | '') => {
        updateRow(key, { golongan_id: golonganId, obat_id: '', dosis: '', frekuensi: '', frekuensiLainnya: false });
    };

    const handleObatChange = (key: number, obatId: number | '') => {
        updateRow(key, { obat_id: obatId, dosis: '', frekuensi: '', frekuensiLainnya: false });
    };

    const handleFrekuensiChange = (key: number, value: string) => {
        if (value === '__lainnya__') {
            updateRow(key, { frekuensi: '', frekuensiLainnya: true });
        } else {
            updateRow(key, { frekuensi: value, frekuensiLainnya: false });
        }
    };

    const addRow = () => {
        const nextKey = rowKeyRef.current++;
        setRows((prev) => [...prev, createEmptyRow(nextKey)]);
    };

    const removeRow = (key: number) => {
        setRows((prev) => (prev.length > 1 ? prev.filter((row) => row.key !== key) : prev));
    };

    const resetForm = () => {
        rowKeyRef.current = 1;
        setRows([createEmptyRow(0)]);
        setShowForm(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const entries = rows
            .filter((row) => row.obat_id && row.dosis && row.frekuensi && row.tanggal_mulai)
            .map((row) => ({
                obat_id: row.obat_id,
                dosis: row.dosis,
                frekuensi: row.frekuensi,
                status: row.status,
                tanggal_mulai: row.tanggal_mulai,
                tanggal_selesai: row.tanggal_selesai || null,
            }));

        if (entries.length === 0) return;

        setSubmitting(true);
        router.post(
            route('obat.store'),
            { entries },
            {
                preserveScroll: true,
                onSuccess: () => resetForm(),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    const openEdit = (item: TerapiRecord) => {
        setEditingId(item.id);
        setEditForm({
            dosis: item.dosis,
            frekuensi: item.frekuensi,
            status: item.status,
            tanggal_mulai: item.tanggal_mulai,
            tanggal_selesai: item.tanggal_selesai || '',
            catatan: item.catatan || '',
        });
    };

    const handleEditSubmit = (id: number, e: React.FormEvent) => {
        e.preventDefault();
        router.put(
            route('obat.update', id),
            { ...editForm, tanggal_selesai: editForm.tanggal_selesai || null },
            {
                preserveScroll: true,
                onSuccess: () => setEditingId(null),
            },
        );
    };

    const handleDelete = (id: number) => {
        router.delete(route('obat.destroy', id), {
            preserveScroll: true,
            onSuccess: () => setConfirmDeleteId(null),
        });
    };

    const formatTanggal = (value: string | null) => {
        if (!value) return '-';
        return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <PwaMainLayout user={user}>
            <div className="min-h-screen">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Obat Saya</h1>
                        <p className="mt-1 text-sm text-gray-600">Catat obat yang sedang atau pernah Anda konsumsi</p>
                    </div>
                    <button
                        onClick={() => setShowForm((v) => !v)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm"
                        aria-label="Tambah obat"
                    >
                        {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-2xl bg-white p-5 shadow-sm">
                        {rows.map((row) => {
                            const obatList = getObatList(row.golongan_id);
                            const selectedObat = getObat(row.golongan_id, row.obat_id);

                            return (
                                <div key={row.key} className="space-y-3 rounded-xl border border-gray-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-700">Obat</p>
                                        {rows.length > 1 && (
                                            <button type="button" onClick={() => removeRow(row.key)} className="text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    <select
                                        className={inputClass}
                                        value={row.golongan_id}
                                        onChange={(e) => handleGolonganChange(row.key, e.target.value ? Number(e.target.value) : '')}
                                    >
                                        <option value="">Pilih Golongan</option>
                                        {masterObat.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.nama}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        className={inputClass}
                                        value={row.obat_id}
                                        disabled={!row.golongan_id}
                                        onChange={(e) => handleObatChange(row.key, e.target.value ? Number(e.target.value) : '')}
                                    >
                                        <option value="">Pilih Nama Obat</option>
                                        {obatList.map((o) => (
                                            <option key={o.id} value={o.id}>
                                                {o.nama_obat}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="grid grid-cols-2 gap-2">
                                        <select
                                            className={inputClass}
                                            value={row.dosis}
                                            disabled={!selectedObat}
                                            onChange={(e) => updateRow(row.key, { dosis: e.target.value })}
                                        >
                                            <option value="">Dosis</option>
                                            {selectedObat?.dosis.map((d) => (
                                                <option key={d.id} value={d.dosis}>
                                                    {d.dosis}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            className={inputClass}
                                            value={row.status}
                                            onChange={(e) => {
                                                const status = e.target.value as TerapiRow['status'];
                                                updateRow(row.key, {
                                                    status,
                                                    tanggal_selesai:
                                                        status === 'dihentikan' && !row.tanggal_selesai
                                                            ? getTodayDateString()
                                                            : row.tanggal_selesai,
                                                });
                                            }}
                                        >
                                            <option value="aktif">Aktif / Rutin</option>
                                            <option value="dosis_diubah">Dosis Diubah</option>
                                            <option value="dihentikan">Dihentikan</option>
                                        </select>
                                    </div>

                                    {row.frekuensiLainnya ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className={inputClass}
                                                placeholder="Aturan pakai lainnya"
                                                value={row.frekuensi}
                                                onChange={(e) => updateRow(row.key, { frekuensi: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                className="rounded-xl border border-gray-200 px-3 text-sm text-gray-500"
                                                onClick={() => updateRow(row.key, { frekuensiLainnya: false, frekuensi: '' })}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            className={inputClass}
                                            value={row.frekuensi}
                                            disabled={!selectedObat}
                                            onChange={(e) => handleFrekuensiChange(row.key, e.target.value)}
                                        >
                                            <option value="">Pilih Aturan Pakai</option>
                                            {selectedObat?.frekuensi.map((f) => (
                                                <option key={f.id} value={f.frekuensi}>
                                                    {f.frekuensi}
                                                </option>
                                            ))}
                                            <option value="__lainnya__">Lainnya...</option>
                                        </select>
                                    )}

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="mb-1 block text-xs text-gray-500">Tanggal Mulai</label>
                                            <input
                                                type="date"
                                                className={inputClass}
                                                value={row.tanggal_mulai}
                                                onChange={(e) => updateRow(row.key, { tanggal_mulai: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs text-gray-500">Tanggal Selesai</label>
                                            <input
                                                type="date"
                                                className={inputClass}
                                                value={row.tanggal_selesai}
                                                onChange={(e) => updateRow(row.key, { tanggal_selesai: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={addRow}
                            className="w-full rounded-xl border border-dashed border-teal-400 py-2.5 text-sm font-medium text-teal-600"
                        >
                            + Tambah Obat Lain
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                        >
                            {submitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </form>
                )}

                <div className="space-y-4">
                    {terapi.length > 0 ? (
                        terapi.map((item) => (
                            <div key={item.id} className="rounded-2xl bg-white p-5 shadow-sm">
                                {editingId === item.id ? (
                                    <form onSubmit={(e) => handleEditSubmit(item.id, e)} className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                className={inputClass}
                                                placeholder="Dosis"
                                                value={editForm.dosis}
                                                onChange={(e) => setEditForm((f) => ({ ...f, dosis: e.target.value }))}
                                            />
                                            <select
                                                className={inputClass}
                                                value={editForm.status}
                                                onChange={(e) => {
                                                    const status = e.target.value;
                                                    setEditForm((f) => ({
                                                        ...f,
                                                        status,
                                                        tanggal_selesai:
                                                            status === 'dihentikan' && !f.tanggal_selesai ? getTodayDateString() : f.tanggal_selesai,
                                                    }));
                                                }}
                                            >
                                                <option value="aktif">Aktif / Rutin</option>
                                                <option value="dosis_diubah">Dosis Diubah</option>
                                                <option value="dihentikan">Dihentikan</option>
                                            </select>
                                        </div>
                                        <input
                                            type="text"
                                            className={inputClass}
                                            placeholder="Aturan pakai"
                                            value={editForm.frekuensi}
                                            onChange={(e) => setEditForm((f) => ({ ...f, frekuensi: e.target.value }))}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="date"
                                                className={inputClass}
                                                value={editForm.tanggal_mulai}
                                                onChange={(e) => setEditForm((f) => ({ ...f, tanggal_mulai: e.target.value }))}
                                            />
                                            <input
                                                type="date"
                                                className={inputClass}
                                                value={editForm.tanggal_selesai}
                                                onChange={(e) => setEditForm((f) => ({ ...f, tanggal_selesai: e.target.value }))}
                                            />
                                        </div>
                                        <textarea
                                            className={inputClass}
                                            rows={2}
                                            placeholder="Catatan (opsional)"
                                            value={editForm.catatan}
                                            onChange={(e) => setEditForm((f) => ({ ...f, catatan: e.target.value }))}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                className="flex-1 rounded-xl border border-gray-200 py-2 text-sm text-gray-600"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Batal
                                            </button>
                                            <button type="submit" className="flex-1 rounded-xl bg-teal-600 py-2 text-sm text-white">
                                                Simpan
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100">
                                                    <Pill className="h-5 w-5 text-teal-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{item.obat.nama_obat}</h3>
                                                    <p className="text-xs text-gray-500">{item.obat.golongan?.nama}</p>
                                                </div>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[item.status]}`}>
                                                {statusLabel[item.status]}
                                            </span>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                                            <p>
                                                Dosis: <span className="font-medium text-gray-800">{item.dosis}</span>
                                            </p>
                                            <p>
                                                Aturan: <span className="font-medium text-gray-800">{item.frekuensi}</span>
                                            </p>
                                        </div>

                                        {item.catatan && <p className="mt-2 text-sm text-gray-600">{item.catatan}</p>}

                                        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                                            <p className="text-xs text-gray-500">
                                                {formatTanggal(item.tanggal_mulai)} &ndash; {formatTanggal(item.tanggal_selesai)}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => openEdit(item)} className="text-teal-600">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => setConfirmDeleteId(item.id)} className="text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {confirmDeleteId === item.id && (
                                            <div className="mt-3 flex items-center justify-between rounded-xl bg-red-50 p-3">
                                                <p className="text-sm text-red-700">Hapus catatan obat ini?</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setConfirmDeleteId(null)}
                                                        className="rounded-lg bg-white px-3 py-1 text-sm text-gray-600"
                                                    >
                                                        Batal
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        !showForm && (
                            <div className="rounded-2xl bg-white p-8 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <Pill className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-800">Belum Ada Catatan Obat</h3>
                                <p className="text-gray-600">Tambahkan obat yang sedang Anda konsumsi</p>
                            </div>
                        )
                    )}
                </div>

                <div className="h-24"></div>
            </div>
        </PwaMainLayout>
    );
}
