import MasterLayout from '@/admin/layouts/MasterLayout';
import { UserType } from '@/pwa/types/userType';
import { useForm } from '@inertiajs/react';
import * as bootstrap from 'bootstrap';
import { useEffect, useRef, useState } from 'react';

interface LogoProps {
    id: number;
    value: string;
}

const AppLogo = ({ user, logo }: { user: UserType; logo: LogoProps | null }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const modalRef = useRef<bootstrap.Modal | null>(null);

    // HANYA GUNAKAN SATU useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        logo: null as File | null,
        _method: 'PATCH',
    });

    // Inisialisasi & cleanup modal
    useEffect(() => {
        const modalEl = document.getElementById('editLogoModal');
        if (modalEl) {
            modalRef.current = new bootstrap.Modal(modalEl);
        }
        return () => {
            modalRef.current?.dispose();
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, []);

    const openModal = () => {
        reset();
        setPreviewImage(null);
        modalRef.current?.show();
    };

    const closeModal = () => {
        modalRef.current?.hide();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewImage) URL.revokeObjectURL(previewImage);

            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewImage(newPreviewUrl);
            setData('logo', file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.app-logo.update'), {
            forceFormData: true,
            onSuccess: () => closeModal(),
            onError: (e) => console.log(e),
        });
    };

    return (
        <MasterLayout user={user}>
            <h6 className="fw-semibold mb-24">App Logo</h6>
            <div className="col-xxl-12 col-xl-12">
                <div className="card h-100">
                    <div className="card-body p-24">
                        <div className="row row-cols-1 g-24">
                            <div>
                                <div className="bg-light rounded text-center">
                                    {logo && logo.value ? (
                                        <img src={`/storage/${logo.value}`} alt="app-logo" className="img-fluid" />
                                    ) : (
                                        <p className="text-muted">Logo belum diatur.</p>
                                    )}
                                </div>
                                <div className="d-flex justify-content-end mt-6">
                                    <button type="button" className="btn btn-primary mt-6 rounded px-10 py-6 text-xl text-white" onClick={openModal}>
                                        <div className="fs-6 mt-2">
                                            Change <i className="ri-edit-line" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="editLogoModal" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header border-top-0 border-start-0 border-end-0 border">
                            <h5 className="modal-title">Edit App Logo</h5>
                            <button type="button" className="btn-close" onClick={closeModal} />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {errors.logo && <div className="alert alert-danger">{errors.logo}</div>}

                                <div className="upload-image-wrapper m-auto gap-3">
                                    <label
                                        htmlFor="logo-upload"
                                        className="upload-file input-form-light radius-8 d-flex align-items-center justify-content-center overflow-hidden border border-dashed bg-neutral-50"
                                    >
                                        <img
                                            src={
                                                previewImage ||
                                                (logo && logo.value ? `/storage/${logo.value}` : 'https://via.placeholder.com/300x150')
                                            }
                                            alt="Preview"
                                            className="img-fluid"
                                        />
                                    </label>
                                    <input id="logo-upload" type="file" hidden accept="image/*" onChange={handleImageChange} />
                                </div>
                                <div className="mt-2 text-center text-muted">Klik gambar untuk mengganti</div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default AppLogo;
