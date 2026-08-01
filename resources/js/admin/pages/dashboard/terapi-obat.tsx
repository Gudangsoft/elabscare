import Breadcrumb from '@/admin/components/Breadcrumb';
import { UserType } from '@/pwa/types/userType';
import { Icon } from '@iconify/react/dist/iconify.js';
import { router, useForm, usePage } from '@inertiajs/react';
import * as bootstrap from 'bootstrap';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import MasterLayout from '../../layouts/MasterLayout';

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

interface PasienOption {
    id: number;
    name: string;
    email: string;
}

interface TerapiRecord {
    id: number;
    user: PasienOption;
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

interface TerapiObatProps {
    user: UserType;
    pasien: PasienOption[];
    terapi: TerapiRecord[];
    masterObat: GolonganOption[];
    selectedUserId: number | null;
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

const statusBadgeClass: Record<string, string> = {
    aktif: 'bg-success-focus text-success-main',
    dosis_diubah: 'bg-warning-focus text-warning-main',
    dihentikan: 'bg-danger-focus text-danger-main',
};

const getTodayDateString = () => new Date().toISOString().slice(0, 10);

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

const TerapiObatPage = ({ user, pasien, terapi, masterObat, selectedUserId }: TerapiObatProps) => {
    const { flash } = usePage().props;
    const typedFlash = flash as { success?: { message: string; id: string }; error?: string };

    const rowKeyRef = useRef(1);
    const [selectedPasienId, setSelectedPasienId] = useState<number | ''>('');
    const [rows, setRows] = useState<TerapiRow[]>([createEmptyRow(0)]);
    const [submitting, setSubmitting] = useState(false);
    const [terapiToDelete, setTerapiToDelete] = useState<number | null>(null);
    const [editingTerapi, setEditingTerapi] = useState<TerapiRecord | null>(null);

    const editModalRef = useRef<bootstrap.Modal | null>(null);
    const deleteModalRef = useRef<bootstrap.Modal | null>(null);

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEditForm,
    } = useForm({
        dosis: '',
        frekuensi: '',
        status: 'aktif',
        tanggal_mulai: '',
        tanggal_selesai: '',
        catatan: '',
    });

    useEffect(() => {
        if (typedFlash.success) {
            Swal.fire({
                title: 'Berhasil',
                text: typedFlash.success.message,
                icon: 'success',
                confirmButtonText: 'OK',
            });
        }
    }, [typedFlash.success?.id]);

    useEffect(() => {
        const editModalEl = document.getElementById('terapiModalEdit');
        const deleteModalEl = document.getElementById('terapiModalDelete');

        if (editModalEl) {
            editModalRef.current = new bootstrap.Modal(editModalEl, { backdrop: 'static', keyboard: false });
        }
        if (deleteModalEl) {
            deleteModalRef.current = new bootstrap.Modal(deleteModalEl, { backdrop: 'static', keyboard: false });
        }

        return () => {
            [editModalRef, deleteModalRef].forEach((ref) => ref.current?.dispose());
        };
    }, []);

    const forceCleanupModal = () => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    };

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
        setSelectedPasienId('');
        rowKeyRef.current = 1;
        setRows([createEmptyRow(0)]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPasienId) {
            Swal.fire({ title: 'Pasien belum dipilih', text: 'Silakan pilih pasien terlebih dahulu.', icon: 'warning' });
            return;
        }

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

        if (entries.length === 0) {
            Swal.fire({ title: 'Belum lengkap', text: 'Lengkapi minimal satu baris obat.', icon: 'warning' });
            return;
        }

        setSubmitting(true);
        router.post(
            route('admin.terapi-obat.store'),
            { user_id: selectedPasienId, entries },
            {
                preserveScroll: true,
                onSuccess: () => resetForm(),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    const openEditModal = (item: TerapiRecord) => {
        setEditingTerapi(item);
        setEditData({
            dosis: item.dosis,
            frekuensi: item.frekuensi,
            status: item.status,
            tanggal_mulai: item.tanggal_mulai,
            tanggal_selesai: item.tanggal_selesai || '',
            catatan: item.catatan || '',
        });
        editModalRef.current?.show();
    };

    const closeEditModal = () => {
        resetEditForm();
        setEditingTerapi(null);
        editModalRef.current?.hide();
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTerapi) return;

        put(route('admin.terapi-obat.update', editingTerapi.id), {
            onSuccess: () => {
                editModalRef.current?.hide();
                resetEditForm();
                setEditingTerapi(null);
                setTimeout(forceCleanupModal, 300);
            },
        });
    };

    const openDeleteModal = (id: number) => {
        setTerapiToDelete(id);
        deleteModalRef.current?.show();
    };

    const closeDeleteModal = () => {
        setTerapiToDelete(null);
        deleteModalRef.current?.hide();
    };

    const handleDelete = () => {
        if (!terapiToDelete) return;
        router.delete(route('admin.terapi-obat.destroy', terapiToDelete), {
            preserveScroll: true,
            onSuccess: () => {
                deleteModalRef.current?.hide();
                setTerapiToDelete(null);
                setTimeout(forceCleanupModal, 300);
            },
        });
    };

    const handleFilterPasien = (userId: string) => {
        router.get(
            route('admin.terapi-obat.index'),
            userId ? { user_id: userId } : {},
            { preserveScroll: true, preserveState: true },
        );
    };

    const formatTanggal = (value: string | null) => {
        if (!value) return '-';
        return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <>
            <MasterLayout user={user}>
                <Breadcrumb title="Terapi Pasien" />

                {/* Form Tambah Terapi */}
                <div className="col-xxl-12 col-xl-12 mb-24">
                    <div className="card h-100">
                        <div className="card-body p-24">
                            <h6 className="fw-semibold mb-16">Tambah Terapi Obat</h6>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-20 col-md-6">
                                    <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Pasien</label>
                                    <select
                                        className="form-select radius-8"
                                        value={selectedPasienId}
                                        onChange={(e) => setSelectedPasienId(e.target.value ? Number(e.target.value) : '')}
                                    >
                                        <option value="">-- Pilih Pasien --</option>
                                        {pasien.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({p.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="table-responsive scroll-sm mb-16">
                                    <table className="bordered-table sm-table mb-0 table">
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: '160px' }}>Golongan</th>
                                                <th style={{ minWidth: '180px' }}>Nama Obat</th>
                                                <th style={{ minWidth: '140px' }}>Dosis</th>
                                                <th style={{ minWidth: '200px' }}>Aturan Pakai</th>
                                                <th style={{ minWidth: '160px' }}>Status Terapi</th>
                                                <th style={{ minWidth: '150px' }}>Tanggal Mulai</th>
                                                <th style={{ minWidth: '150px' }}>Tanggal Selesai</th>
                                                <th className="text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row) => {
                                                const obatList = getObatList(row.golongan_id);
                                                const selectedObat = getObat(row.golongan_id, row.obat_id);

                                                return (
                                                    <tr key={row.key}>
                                                        <td>
                                                            <select
                                                                className="form-select radius-8"
                                                                value={row.golongan_id}
                                                                onChange={(e) =>
                                                                    handleGolonganChange(row.key, e.target.value ? Number(e.target.value) : '')
                                                                }
                                                            >
                                                                <option value="">Pilih Golongan</option>
                                                                {masterObat.map((g) => (
                                                                    <option key={g.id} value={g.id}>
                                                                        {g.nama}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="form-select radius-8"
                                                                value={row.obat_id}
                                                                disabled={!row.golongan_id}
                                                                onChange={(e) =>
                                                                    handleObatChange(row.key, e.target.value ? Number(e.target.value) : '')
                                                                }
                                                            >
                                                                <option value="">Pilih Obat</option>
                                                                {obatList.map((o) => (
                                                                    <option key={o.id} value={o.id}>
                                                                        {o.nama_obat}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="form-select radius-8"
                                                                value={row.dosis}
                                                                disabled={!selectedObat}
                                                                onChange={(e) => updateRow(row.key, { dosis: e.target.value })}
                                                            >
                                                                <option value="">Pilih Dosis</option>
                                                                {selectedObat?.dosis.map((d) => (
                                                                    <option key={d.id} value={d.dosis}>
                                                                        {d.dosis}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            {row.frekuensiLainnya ? (
                                                                <div className="d-flex gap-1">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control radius-8"
                                                                        placeholder="Aturan pakai lainnya"
                                                                        value={row.frekuensi}
                                                                        onChange={(e) => updateRow(row.key, { frekuensi: e.target.value })}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-secondary btn-sm"
                                                                        onClick={() => updateRow(row.key, { frekuensiLainnya: false, frekuensi: '' })}
                                                                    >
                                                                        <i className="ri-close-line" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <select
                                                                    className="form-select radius-8"
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
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="form-select radius-8"
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
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                className="form-control radius-8"
                                                                value={row.tanggal_mulai}
                                                                onChange={(e) => updateRow(row.key, { tanggal_mulai: e.target.value })}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                className="form-control radius-8"
                                                                value={row.tanggal_selesai}
                                                                onChange={(e) => updateRow(row.key, { tanggal_selesai: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            {rows.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="text-danger-600 text-xl"
                                                                    onClick={() => removeRow(row.key)}
                                                                >
                                                                    <i className="ri-delete-bin-6-line" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex align-items-center justify-content-between">
                                    <button type="button" className="btn btn-outline-primary radius-8" onClick={addRow}>
                                        + Tambah Obat Lain
                                    </button>
                                    <button type="submit" className="btn btn-primary radius-8 px-24" disabled={submitting}>
                                        {submitting ? 'Menyimpan...' : 'Simpan Terapi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Riwayat Terapi */}
                <div className="col-xxl-12 col-xl-12">
                    <div className="card h-100">
                        <div className="card-body p-24">
                            <div className="d-flex align-items-center justify-content-between mb-16">
                                <h6 className="fw-semibold mb-0">Riwayat Terapi Pasien</h6>
                                <select
                                    className="form-select radius-8"
                                    style={{ maxWidth: '280px' }}
                                    value={selectedUserId || ''}
                                    onChange={(e) => handleFilterPasien(e.target.value)}
                                >
                                    <option value="">Semua Pasien</option>
                                    {pasien.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="table-responsive scroll-sm">
                                <table className="bordered-table sm-table mb-0 table">
                                    <thead>
                                        <tr>
                                            <th>Pasien</th>
                                            <th>Obat</th>
                                            <th>Dosis</th>
                                            <th>Aturan Pakai</th>
                                            <th className="text-center">Status</th>
                                            <th>Periode</th>
                                            <th className="text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {terapi.length > 0 ? (
                                            terapi.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.user.name}</td>
                                                    <td>
                                                        <h6 className="text-md fw-medium mb-0">{item.obat.nama_obat}</h6>
                                                        <span className="text-secondary-light fw-medium text-sm">
                                                            {item.obat.golongan?.nama}
                                                        </span>
                                                    </td>
                                                    <td>{item.dosis}</td>
                                                    <td>{item.frekuensi}</td>
                                                    <td className="text-center">
                                                        <span className={`rounded-pill fw-medium px-16 py-4 text-sm ${statusBadgeClass[item.status]}`}>
                                                            {statusLabel[item.status]}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {formatTanggal(item.tanggal_mulai)} - {formatTanggal(item.tanggal_selesai)}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="d-inline-flex align-items-center gap-12">
                                                            <button
                                                                type="button"
                                                                className="text-success-600 text-xl"
                                                                onClick={() => openEditModal(item)}
                                                            >
                                                                <i className="ri-edit-line" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="text-danger-600 remove-btn text-xl"
                                                                onClick={() => openDeleteModal(item.id)}
                                                            >
                                                                <i className="ri-delete-bin-6-line" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="text-secondary-light text-center">
                                                    Belum ada riwayat terapi
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Edit */}
                <div className="modal fade" id="terapiModalEdit" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-header border-top-0 border-start-0 border-end-0 border px-24 py-16">
                                <h1 className="modal-title fs-5">Edit Terapi Obat</h1>
                                <button type="button" className="btn-close" onClick={closeEditModal} />
                            </div>
                            <div className="modal-body p-24">
                                {editingTerapi && (
                                    <form onSubmit={handleEditSubmit}>
                                        <div className="mb-20">
                                            <h6 className="fw-semibold mb-0">
                                                {editingTerapi.user.name} &ndash; {editingTerapi.obat.nama_obat}
                                            </h6>
                                        </div>
                                        <div className="row">
                                            <div className="col-6 mb-20">
                                                <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Dosis</label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    value={editData.dosis}
                                                    onChange={(e) => setEditData('dosis', e.target.value)}
                                                />
                                                {editErrors.dosis && <div className="text-danger text-sm mt-1">{editErrors.dosis}</div>}
                                            </div>
                                            <div className="col-6 mb-20">
                                                <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Aturan Pakai</label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    value={editData.frekuensi}
                                                    onChange={(e) => setEditData('frekuensi', e.target.value)}
                                                />
                                                {editErrors.frekuensi && <div className="text-danger text-sm mt-1">{editErrors.frekuensi}</div>}
                                            </div>
                                            <div className="col-6 mb-20">
                                                <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Status Terapi</label>
                                                <select
                                                    className="form-select radius-8"
                                                    value={editData.status}
                                                    onChange={(e) => {
                                                        const status = e.target.value;
                                                        setEditData((prev) => ({
                                                            ...prev,
                                                            status,
                                                            tanggal_selesai:
                                                                status === 'dihentikan' && !prev.tanggal_selesai
                                                                    ? getTodayDateString()
                                                                    : prev.tanggal_selesai,
                                                        }));
                                                    }}
                                                >
                                                    <option value="aktif">Aktif / Rutin</option>
                                                    <option value="dosis_diubah">Dosis Diubah</option>
                                                    <option value="dihentikan">Dihentikan</option>
                                                </select>
                                            </div>
                                            <div className="col-6 mb-20"></div>
                                            <div className="col-6 mb-20">
                                                <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Tanggal Mulai</label>
                                                <input
                                                    type="date"
                                                    className="form-control radius-8"
                                                    value={editData.tanggal_mulai}
                                                    onChange={(e) => setEditData('tanggal_mulai', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-6 mb-20">
                                                <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Tanggal Selesai</label>
                                                <input
                                                    type="date"
                                                    className="form-control radius-8"
                                                    value={editData.tanggal_selesai}
                                                    onChange={(e) => setEditData('tanggal_selesai', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-12 mb-20">
                                                <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Catatan</label>
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    value={editData.catatan}
                                                    onChange={(e) => setEditData('catatan', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="modal-footer border-0">
                                            <button type="button" className="btn btn-secondary me-2" onClick={closeEditModal}>
                                                Batal
                                            </button>
                                            <button type="submit" className="btn btn-primary" disabled={editProcessing}>
                                                {editProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Hapus */}
                <div className="modal fade" id="terapiModalDelete" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-sm modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-body p-24 text-center">
                                <span className="fs-1 line-height-1 text-danger mb-16">
                                    <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                                </span>
                                <h6 className="fw-semibold text-primary-light mb-0 text-lg">Yakin ingin menghapus riwayat terapi ini?</h6>
                                <div className="d-flex align-items-center justify-content-center mt-24 gap-3">
                                    <button
                                        type="button"
                                        className="btn btn-danger-outline border-danger-600 bg-hover-danger-200 text-danger-600 text-md radius-8 border px-32 py-12"
                                        onClick={closeDeleteModal}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary border-primary-600 text-md radius-8 w-50 border px-24 py-12"
                                        onClick={handleDelete}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MasterLayout>
        </>
    );
};

export default TerapiObatPage;
