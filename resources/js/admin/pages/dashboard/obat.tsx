import Breadcrumb from '@/admin/components/Breadcrumb';
import { UserType } from '@/pwa/types/userType';
import { Icon } from '@iconify/react/dist/iconify.js';
import { router, useForm, usePage } from '@inertiajs/react';
import * as bootstrap from 'bootstrap';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import MasterLayout from '../../layouts/MasterLayout';

interface GolonganData {
    id: number;
    nama: string;
}

interface DosisItem {
    id: number;
    dosis: string;
}

interface FrekuensiItem {
    id: number;
    frekuensi: string;
}

interface ObatData {
    id: number;
    obat_golongan_id: number;
    sub_golongan: string | null;
    nama_obat: string;
    is_active: boolean;
    golongan: GolonganData;
    dosis: DosisItem[];
    frekuensi: FrekuensiItem[];
}

interface ObatProps {
    user: UserType;
    obat: ObatData[];
    golongan: GolonganData[];
}

const emptyForm = {
    obat_golongan_id: '' as number | '',
    golongan_baru: '',
    sub_golongan: '',
    nama_obat: '',
    is_active: true,
    dosis: [''] as string[],
    frekuensi: [''] as string[],
};

const Obat = ({ user, obat, golongan }: ObatProps) => {
    const { flash } = usePage().props;
    const typedFlash = flash as { success?: { message: string; id: string }; error?: string };

    const [obatToDelete, setObatToDelete] = useState<number | null>(null);
    const [editingObat, setEditingObat] = useState<ObatData | null>(null);

    const addModalRef = useRef<bootstrap.Modal | null>(null);
    const editModalRef = useRef<bootstrap.Modal | null>(null);
    const deleteModalRef = useRef<bootstrap.Modal | null>(null);

    const { data, setData, post, processing, errors, reset, transform } = useForm(emptyForm);
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEditForm,
        transform: editTransform,
    } = useForm(emptyForm);

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
        const addModalEl = document.getElementById('obatModalAdd');
        const editModalEl = document.getElementById('obatModalEdit');
        const deleteModalEl = document.getElementById('obatModalDelete');

        if (addModalEl) {
            addModalRef.current = new bootstrap.Modal(addModalEl, { backdrop: 'static', keyboard: false });
        }
        if (editModalEl) {
            editModalRef.current = new bootstrap.Modal(editModalEl, { backdrop: 'static', keyboard: false });
        }
        if (deleteModalEl) {
            deleteModalRef.current = new bootstrap.Modal(deleteModalEl, { backdrop: 'static', keyboard: false });
        }

        return () => {
            [addModalRef, editModalRef, deleteModalRef].forEach((ref) => {
                if (ref.current) {
                    ref.current.dispose();
                }
            });
        };
    }, []);

    const forceCleanupModal = () => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    };

    const openAddModal = () => {
        reset();
        addModalRef.current?.show();
    };

    const closeAddModal = () => {
        reset();
        addModalRef.current?.hide();
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((formData) => ({
            ...formData,
            dosis: formData.dosis.map((d) => d.trim()).filter(Boolean),
            frekuensi: formData.frekuensi.map((f) => f.trim()).filter(Boolean),
        }));
        post(route('admin.obat.store'), {
            onSuccess: () => {
                addModalRef.current?.hide();
                reset();
                setTimeout(forceCleanupModal, 300);
            },
        });
    };

    const openEditModal = (item: ObatData) => {
        setEditingObat(item);
        setEditData({
            obat_golongan_id: item.obat_golongan_id,
            golongan_baru: '',
            sub_golongan: item.sub_golongan || '',
            nama_obat: item.nama_obat,
            is_active: item.is_active,
            dosis: item.dosis.length > 0 ? item.dosis.map((d) => d.dosis) : [''],
            frekuensi: item.frekuensi.length > 0 ? item.frekuensi.map((f) => f.frekuensi) : [''],
        });
        editModalRef.current?.show();
    };

    const closeEditModal = () => {
        resetEditForm();
        setEditingObat(null);
        editModalRef.current?.hide();
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingObat) return;

        editTransform((formData) => ({
            ...formData,
            dosis: formData.dosis.map((d) => d.trim()).filter(Boolean),
            frekuensi: formData.frekuensi.map((f) => f.trim()).filter(Boolean),
        }));
        put(route('admin.obat.update', editingObat.id), {
            onSuccess: () => {
                editModalRef.current?.hide();
                resetEditForm();
                setEditingObat(null);
                setTimeout(forceCleanupModal, 300);
            },
        });
    };

    const openDeleteModal = (id: number) => {
        setObatToDelete(id);
        deleteModalRef.current?.show();
    };

    const closeDeleteModal = () => {
        setObatToDelete(null);
        deleteModalRef.current?.hide();
    };

    const handleDelete = () => {
        if (!obatToDelete) return;
        router.delete(route('admin.obat.destroy', obatToDelete), {
            preserveScroll: true,
            onSuccess: () => {
                deleteModalRef.current?.hide();
                setObatToDelete(null);
                setTimeout(forceCleanupModal, 300);
            },
        });
    };

    const handleToggleActive = (item: ObatData) => {
        router.patch(
            route('admin.obat.update', item.id),
            {
                obat_golongan_id: item.obat_golongan_id,
                sub_golongan: item.sub_golongan,
                nama_obat: item.nama_obat,
                is_active: !item.is_active,
                dosis: item.dosis.map((d) => d.dosis),
                frekuensi: item.frekuensi.map((f) => f.frekuensi),
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    const renderDosisFields = (
        values: string[],
        onChange: (index: number, value: string) => void,
        onAdd: () => void,
        onRemove: (index: number) => void,
        errorMessage?: string,
    ) => (
        <div className="col-6 mb-20">
            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Pilihan Dosis</label>
            {values.map((value, index) => (
                <div key={index} className="mb-8 d-flex gap-2">
                    <input
                        type="text"
                        className="form-control radius-8"
                        placeholder="mis. 12.5 mg"
                        value={value}
                        onChange={(e) => onChange(index, e.target.value)}
                    />
                    {values.length > 1 && (
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onRemove(index)}>
                            <i className="ri-close-line" />
                        </button>
                    )}
                </div>
            ))}
            <button type="button" className="btn btn-outline-primary btn-sm mt-1" onClick={onAdd}>
                + Tambah Dosis
            </button>
            {errorMessage && <div className="text-danger text-sm mt-1">{errorMessage}</div>}
        </div>
    );

    const renderFrekuensiFields = (
        values: string[],
        onChange: (index: number, value: string) => void,
        onAdd: () => void,
        onRemove: (index: number) => void,
        errorMessage?: string,
    ) => (
        <div className="col-6 mb-20">
            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Pilihan Frekuensi / Aturan Pakai</label>
            {values.map((value, index) => (
                <div key={index} className="mb-8 d-flex gap-2">
                    <input
                        type="text"
                        className="form-control radius-8"
                        placeholder="mis. 1 x 1 sehari (pagi hari)"
                        value={value}
                        onChange={(e) => onChange(index, e.target.value)}
                    />
                    {values.length > 1 && (
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onRemove(index)}>
                            <i className="ri-close-line" />
                        </button>
                    )}
                </div>
            ))}
            <button type="button" className="btn btn-outline-primary btn-sm mt-1" onClick={onAdd}>
                + Tambah Frekuensi
            </button>
            {errorMessage && <div className="text-danger text-sm mt-1">{errorMessage}</div>}
        </div>
    );

    return (
        <>
            <MasterLayout user={user}>
                <Breadcrumb title="Master Obat" />

                <button type="button" className="btn btn-primary-600 radius-8 mb-16 px-18 py-8" onClick={openAddModal}>
                    <i className="ri-add-line me-1" /> Tambah Obat
                </button>

                <div className="col-xxl-12 col-xl-12">
                    <div className="card h-100">
                        <div className="card-body p-24">
                            <div className="table-responsive scroll-sm">
                                <table className="bordered-table sm-table mb-0 table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Nama Obat</th>
                                            <th scope="col">Golongan</th>
                                            <th scope="col">Dosis</th>
                                            <th scope="col">Frekuensi</th>
                                            <th scope="col" className="text-center">
                                                Status
                                            </th>
                                            <th scope="col" className="text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {obat && obat.length > 0 ? (
                                            obat.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <h6 className="text-md fw-medium mb-0">{item.nama_obat}</h6>
                                                        {item.sub_golongan && (
                                                            <span className="text-secondary-light fw-medium text-sm">{item.sub_golongan}</span>
                                                        )}
                                                    </td>
                                                    <td>{item.golongan?.nama || '-'}</td>
                                                    <td>
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {item.dosis.map((d) => (
                                                                <span key={d.id} className="badge bg-neutral-200 text-neutral-900 fw-normal">
                                                                    {d.dosis}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column gap-1" style={{ maxWidth: '260px' }}>
                                                            {item.frekuensi.map((f) => (
                                                                <span key={f.id} className="text-secondary-light text-sm">
                                                                    {f.frekuensi}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="form-switch switch-success d-flex align-items-center justify-content-center gap-1">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                role="switch"
                                                                id={`switch-obat-${item.id}`}
                                                                checked={item.is_active}
                                                                onChange={() => handleToggleActive(item)}
                                                            />
                                                        </div>
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
                                                <td colSpan={6} className="text-secondary-light text-center">
                                                    Belum ada data obat
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Tambah */}
                <div className="modal fade" id="obatModalAdd" tabIndex={-1} aria-labelledby="obatModalAddLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-header border-top-0 border-start-0 border-end-0 border px-24 py-16">
                                <h1 className="modal-title fs-5" id="obatModalAddLabel">
                                    Tambah Obat
                                </h1>
                                <button type="button" className="btn-close" onClick={closeAddModal} />
                            </div>
                            <div className="modal-body p-24">
                                <form onSubmit={handleAddSubmit}>
                                    <div className="row">
                                        <div className="col-6 mb-20">
                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Golongan Terapi</label>
                                            <select
                                                className="form-select radius-8"
                                                value={data.obat_golongan_id}
                                                onChange={(e) => setData('obat_golongan_id', e.target.value ? Number(e.target.value) : '')}
                                            >
                                                <option value="">-- Pilih Golongan --</option>
                                                {golongan.map((g) => (
                                                    <option key={g.id} value={g.id}>
                                                        {g.nama}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.obat_golongan_id && <div className="text-danger text-sm mt-1">{errors.obat_golongan_id}</div>}
                                        </div>
                                        <div className="col-6 mb-20">
                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Atau Golongan Baru</label>
                                            <input
                                                type="text"
                                                className="form-control radius-8"
                                                placeholder="mis. Antihipertensi"
                                                value={data.golongan_baru}
                                                onChange={(e) => setData('golongan_baru', e.target.value)}
                                            />
                                            {errors.golongan_baru && <div className="text-danger text-sm mt-1">{errors.golongan_baru}</div>}
                                        </div>
                                        <div className="col-6 mb-20">
                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Sub Golongan</label>
                                            <input
                                                type="text"
                                                className="form-control radius-8"
                                                placeholder="mis. ACE Inhibitor (ACEi)"
                                                value={data.sub_golongan}
                                                onChange={(e) => setData('sub_golongan', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-6 mb-20">
                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Nama Obat</label>
                                            <input
                                                type="text"
                                                className="form-control radius-8"
                                                value={data.nama_obat}
                                                onChange={(e) => setData('nama_obat', e.target.value)}
                                            />
                                            {errors.nama_obat && <div className="text-danger text-sm mt-1">{errors.nama_obat}</div>}
                                        </div>
                                        {renderDosisFields(
                                            data.dosis,
                                            (index, value) =>
                                                setData(
                                                    'dosis',
                                                    data.dosis.map((d, i) => (i === index ? value : d)),
                                                ),
                                            () => setData('dosis', [...data.dosis, '']),
                                            (index) => setData('dosis', data.dosis.filter((_, i) => i !== index)),
                                            errors.dosis,
                                        )}
                                        {renderFrekuensiFields(
                                            data.frekuensi,
                                            (index, value) =>
                                                setData(
                                                    'frekuensi',
                                                    data.frekuensi.map((f, i) => (i === index ? value : f)),
                                                ),
                                            () => setData('frekuensi', [...data.frekuensi, '']),
                                            (index) => setData('frekuensi', data.frekuensi.filter((_, i) => i !== index)),
                                            errors.frekuensi,
                                        )}
                                        <div className="col-12 mb-20">
                                            <div className="form-switch switch-success d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    id="add-is-active"
                                                    checked={data.is_active}
                                                    onChange={(e) => setData('is_active', e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="add-is-active">
                                                    Aktif
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0">
                                        <button type="button" className="btn btn-secondary me-2" onClick={closeAddModal}>
                                            Batal
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? 'Menyimpan...' : 'Simpan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Edit */}
                <div className="modal fade" id="obatModalEdit" tabIndex={-1} aria-labelledby="obatModalEditLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-header border-top-0 border-start-0 border-end-0 border px-24 py-16">
                                <h1 className="modal-title fs-5" id="obatModalEditLabel">
                                    Edit Obat
                                </h1>
                                <button type="button" className="btn-close" onClick={closeEditModal} />
                            </div>
                            <div className="modal-body p-24">
                                {editingObat && (
                                    <form onSubmit={handleEditSubmit}>
                                        <div className="row">
                                            <div className="col-6 mb-20">
                                                <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Golongan Terapi</label>
                                                <select
                                                    className="form-select radius-8"
                                                    value={editData.obat_golongan_id}
                                                    onChange={(e) =>
                                                        setEditData('obat_golongan_id', e.target.value ? Number(e.target.value) : '')
                                                    }
                                                >
                                                    <option value="">-- Pilih Golongan --</option>
                                                    {golongan.map((g) => (
                                                        <option key={g.id} value={g.id}>
                                                            {g.nama}
                                                        </option>
                                                    ))}
                                                </select>
                                                {editErrors.obat_golongan_id && (
                                                    <div className="text-danger text-sm mt-1">{editErrors.obat_golongan_id}</div>
                                                )}
                                            </div>
                                            <div className="col-6 mb-20">
                                                <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Atau Golongan Baru</label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    placeholder="mis. Antihipertensi"
                                                    value={editData.golongan_baru}
                                                    onChange={(e) => setEditData('golongan_baru', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-6 mb-20">
                                                <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Sub Golongan</label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    value={editData.sub_golongan}
                                                    onChange={(e) => setEditData('sub_golongan', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-6 mb-20">
                                                <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Nama Obat</label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    value={editData.nama_obat}
                                                    onChange={(e) => setEditData('nama_obat', e.target.value)}
                                                />
                                                {editErrors.nama_obat && <div className="text-danger text-sm mt-1">{editErrors.nama_obat}</div>}
                                            </div>
                                            {renderDosisFields(
                                                editData.dosis,
                                                (index, value) =>
                                                    setEditData(
                                                        'dosis',
                                                        editData.dosis.map((d, i) => (i === index ? value : d)),
                                                    ),
                                                () => setEditData('dosis', [...editData.dosis, '']),
                                                (index) => setEditData('dosis', editData.dosis.filter((_, i) => i !== index)),
                                                editErrors.dosis,
                                            )}
                                            {renderFrekuensiFields(
                                                editData.frekuensi,
                                                (index, value) =>
                                                    setEditData(
                                                        'frekuensi',
                                                        editData.frekuensi.map((f, i) => (i === index ? value : f)),
                                                    ),
                                                () => setEditData('frekuensi', [...editData.frekuensi, '']),
                                                (index) => setEditData('frekuensi', editData.frekuensi.filter((_, i) => i !== index)),
                                                editErrors.frekuensi,
                                            )}
                                            <div className="col-12 mb-20">
                                                <div className="form-switch switch-success d-flex align-items-center gap-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        id="edit-is-active"
                                                        checked={editData.is_active}
                                                        onChange={(e) => setEditData('is_active', e.target.checked)}
                                                    />
                                                    <label className="form-check-label" htmlFor="edit-is-active">
                                                        Aktif
                                                    </label>
                                                </div>
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
                <div className="modal fade" id="obatModalDelete" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-sm modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-body p-24 text-center">
                                <span className="fs-1 line-height-1 text-danger mb-16">
                                    <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                                </span>
                                <h6 className="fw-semibold text-primary-light mb-0 text-lg">Yakin ingin menghapus obat ini?</h6>
                                <p className="text-secondary-light text-sm">Riwayat terapi pasien yang memakai obat ini juga akan terhapus.</p>
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

export default Obat;
