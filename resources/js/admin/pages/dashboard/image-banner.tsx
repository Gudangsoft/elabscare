import MasterLayout from '@/admin/layouts/MasterLayout';
import { UserType } from '@/pwa/types/userType';
import { Icon } from '@iconify/react/dist/iconify.js';
import { router, useForm } from '@inertiajs/react';
import * as bootstrap from 'bootstrap';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface BannerProps {
    id: number;
    full_image_url: string | undefined;
    image_path: string;
    is_active: boolean;
    order: number;
}

const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                }
            },
            'image/jpeg',
            0.95,
        );
    });
};

const Dashboard = ({ user, banners }: { banners: BannerProps[]; user: UserType }) => {
    const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);
    const [editingBanner, setEditingBanner] = useState<BannerProps | null>(null);
    const [editPreviewImage, setEditPreviewImage] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [selectedImageForCrop, setSelectedImageForCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [showCropModal, setShowCropModal] = useState(false);
    const [originalFile, setOriginalFile] = useState<File | null>(null);

    const [editSelectedImageForCrop, setEditSelectedImageForCrop] = useState<string | null>(null);
    const [editCrop, setEditCrop] = useState<Crop>();
    const [editCompletedCrop, setEditCompletedCrop] = useState<PixelCrop>();
    const [showEditCropModal, setShowEditCropModal] = useState(false);
    const [editOriginalFile, setEditOriginalFile] = useState<File | null>(null);

    const addModalRef = useRef<bootstrap.Modal | null>(null);
    const editModalRef = useRef<bootstrap.Modal | null>(null);
    const deleteModalRef = useRef<bootstrap.Modal | null>(null);
    const cropModalRef = useRef<bootstrap.Modal | null>(null);
    const editCropModalRef = useRef<bootstrap.Modal | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const editImgRef = useRef<HTMLImageElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        banner_image: null as File | null,
    });

    const {
        data: editData,
        setData: setEditData,
        post: updateBanner,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEditForm,
    } = useForm({
        banner_image: null as File | null,
        _method: 'PATCH',
    });

    useEffect(() => {
        const addModalEl = document.getElementById('exampleModalAdd');
        const editModalEl = document.getElementById('exampleModalEdit');
        const deleteModalEl = document.getElementById('exampleModalDelete');
        const cropModalEl = document.getElementById('cropModal');
        const editCropModalEl = document.getElementById('editCropModal');

        if (addModalEl) {
            addModalRef.current = new bootstrap.Modal(addModalEl, {
                backdrop: 'static',
                keyboard: false,
            });
        }
        if (editModalEl) {
            editModalRef.current = new bootstrap.Modal(editModalEl, {
                backdrop: 'static',
                keyboard: false,
            });
        }
        if (deleteModalEl) {
            deleteModalRef.current = new bootstrap.Modal(deleteModalEl, {
                backdrop: 'static',
                keyboard: false,
            });
        }
        if (cropModalEl) {
            cropModalRef.current = new bootstrap.Modal(cropModalEl, {
                backdrop: 'static',
                keyboard: false,
            });
        }
        if (editCropModalEl) {
            editCropModalRef.current = new bootstrap.Modal(editCropModalEl, {
                backdrop: 'static',
                keyboard: false,
            });
        }

        return () => {
            [addModalRef, editModalRef, deleteModalRef, cropModalRef, editCropModalRef].forEach((ref) => {
                if (ref.current) {
                    ref.current.dispose();
                }
            });

            [previewImage, editPreviewImage, selectedImageForCrop, editSelectedImageForCrop].forEach((url) => {
                if (url) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []);

    const forceCleanupModal = () => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach((backdrop) => {
            backdrop.remove();
        });
    };

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                16 / 9, // aspect ratio
                width,
                height,
            ),
            width,
            height,
        );
        setCrop(crop);
    }, []);

    const onEditImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                16 / 9,
                width,
                height,
            ),
            width,
            height,
        );
        setEditCrop(crop);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (!file.type.startsWith('image/')) {
                console.error('Invalid file type');
                return;
            }

            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }

            setOriginalFile(file);
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewImage(newPreviewUrl);
            setData('banner_image', file);
        }
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (!file.type.startsWith('image/')) {
                console.error('Invalid file type');
                return;
            }

            if (editPreviewImage) {
                URL.revokeObjectURL(editPreviewImage);
            }

            setEditOriginalFile(file);
            const newPreviewUrl = URL.createObjectURL(file);
            setEditPreviewImage(newPreviewUrl);
            setEditData('banner_image', file);
        }
    };

    const openCropModal = () => {
        if (originalFile && previewImage) {
            setSelectedImageForCrop(previewImage);
            setShowCropModal(true);

            if (cropModalRef.current) {
                cropModalRef.current.show();
            }
        }
    };

    const openEditCropModal = () => {
        if (editOriginalFile && editPreviewImage) {
            setEditSelectedImageForCrop(editPreviewImage);
            setShowEditCropModal(true);

            if (editCropModalRef.current) {
                editCropModalRef.current.show();
            }
        }
    };

    const applyCrop = async () => {
        if (completedCrop && imgRef.current && originalFile) {
            try {
                const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
                const croppedFile = new File([croppedBlob], originalFile.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                });

                if (previewImage) {
                    URL.revokeObjectURL(previewImage);
                }

                setData('banner_image', croppedFile);
                const newPreviewUrl = URL.createObjectURL(croppedFile);
                setPreviewImage(newPreviewUrl);

                if (cropModalRef.current) {
                    cropModalRef.current.hide();
                }
                setShowCropModal(false);

                if (selectedImageForCrop) {
                    URL.revokeObjectURL(selectedImageForCrop);
                    setSelectedImageForCrop(null);
                }

                setCrop(undefined);
                setCompletedCrop(undefined);
            } catch (error) {
                console.error('Error cropping image:', error);
            }
        }
    };

    const applyEditCrop = async () => {
        if (editCompletedCrop && editImgRef.current && editOriginalFile) {
            try {
                const croppedBlob = await getCroppedImg(editImgRef.current, editCompletedCrop);
                const croppedFile = new File([croppedBlob], editOriginalFile.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                });

                if (editPreviewImage) {
                    URL.revokeObjectURL(editPreviewImage);
                }

                setEditData('banner_image', croppedFile);
                const newPreviewUrl = URL.createObjectURL(croppedFile);
                setEditPreviewImage(newPreviewUrl);

                if (editCropModalRef.current) {
                    editCropModalRef.current.hide();
                }
                setShowEditCropModal(false);

                if (editSelectedImageForCrop) {
                    URL.revokeObjectURL(editSelectedImageForCrop);
                    setEditSelectedImageForCrop(null);
                }

                setEditCrop(undefined);
                setEditCompletedCrop(undefined);
            } catch (error) {
                console.error('Error cropping edit image:', error);
            }
        }
    };

    const cancelCrop = () => {
        if (cropModalRef.current) {
            cropModalRef.current.hide();
        }
        setShowCropModal(false);

        if (selectedImageForCrop) {
            URL.revokeObjectURL(selectedImageForCrop);
            setSelectedImageForCrop(null);
        }

        setCrop(undefined);
        setCompletedCrop(undefined);
    };

    const cancelEditCrop = () => {
        if (editCropModalRef.current) {
            editCropModalRef.current.hide();
        }
        setShowEditCropModal(false);

        if (editSelectedImageForCrop) {
            URL.revokeObjectURL(editSelectedImageForCrop);
            setEditSelectedImageForCrop(null);
        }

        setEditCrop(undefined);
        setEditCompletedCrop(undefined);
    };

    const handleDeleteBanner = (bannerId: string) => {
        router.delete(route('admin.banner-images.destroy', bannerId), {
            preserveScroll: true,
            onSuccess: () => {
                if (deleteModalRef.current) {
                    deleteModalRef.current.hide();
                }
                setBannerToDelete(null);

                setTimeout(() => {
                    forceCleanupModal();
                }, 300);
            },
            onError: (error) => {
                console.error(`Failed to delete banner image with ID ${bannerId}:`, error);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBanner) return;

        updateBanner(route('admin.banner-images.update', editingBanner.id), {
            onSuccess: () => {
                if (editModalRef.current) {
                    editModalRef.current.hide();
                }

                resetEditForm();
                setEditingBanner(null);
                if (editPreviewImage) {
                    URL.revokeObjectURL(editPreviewImage);
                    setEditPreviewImage(null);
                }

                setTimeout(() => {
                    forceCleanupModal();
                }, 300);
            },
            onError: (e) => {
                console.log(e);
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.banner-images.store'), {
            onSuccess: () => {
                if (addModalRef.current) {
                    addModalRef.current.hide();
                }

                reset('banner_image');
                if (previewImage) {
                    URL.revokeObjectURL(previewImage);
                    setPreviewImage(null);
                }

                setTimeout(() => {
                    forceCleanupModal();
                }, 300);
            },
            onError: (errors) => {
                console.log('Form errors:', errors);
            },
        });
    };

    const handleToggleActiveChange = (banner: BannerProps) => {
        router.patch(
            route('admin.banner-images.update', banner.id),
            {
                is_active: !banner.is_active,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {},
                onError: (errors) => {
                    console.error('Error updating banner active status:', errors);
                },
            },
        );
    };

    const openAddModal = () => {
        reset('banner_image');
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
        }

        if (addModalRef.current) {
            addModalRef.current.show();
        }
    };

    const openEditModal = (banner: BannerProps) => {
        resetEditForm();
        if (editPreviewImage) {
            URL.revokeObjectURL(editPreviewImage);
            setEditPreviewImage(null);
        }
        setEditingBanner(banner);

        if (editModalRef.current) {
            editModalRef.current.show();
        }
    };

    const openDeleteModal = (bannerId: number) => {
        setBannerToDelete(bannerId);

        if (deleteModalRef.current) {
            deleteModalRef.current.show();
        }
    };

    const closeAddModal = () => {
        reset('banner_image');
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
        }

        if (addModalRef.current) {
            addModalRef.current.hide();
        }
    };

    const closeEditModal = () => {
        resetEditForm();
        setEditingBanner(null);
        if (editPreviewImage) {
            URL.revokeObjectURL(editPreviewImage);
            setEditPreviewImage(null);
        }

        if (editModalRef.current) {
            editModalRef.current.hide();
        }
    };

    const closeDeleteModal = () => {
        setBannerToDelete(null);

        if (deleteModalRef.current) {
            deleteModalRef.current.hide();
        }
    };

    return (
        <>
            <MasterLayout user={user}>
                <button type="button" className="btn btn-primary-600 radius-8 mb-6 px-18 py-8" onClick={openAddModal}>
                    Add Images
                </button>

                <div className="col-xxl-12 col-xl-12">
                    <div className="card h-100">
                        <div className="card-body p-24">
                            {banners && banners.length > 0 ? (
                                <div className="row row-cols-xxl-3 row-cols-lg-3 row-cols-md-2 row-cols-1 g-24">
                                    {banners.map((banner, index) => (
                                        <div key={banner.id}>
                                            <img src={banner.full_image_url} alt="banner-images" className="img-fluid" />
                                            <div className="d-flex align-items-center justify-content-between mt-12">
                                                <div className="form-switch switch-success d-flex align-items-center gap-1">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        id={`switch-${banner.id}`}
                                                        checked={banner.is_active}
                                                        onChange={() => handleToggleActiveChange(banner)}
                                                    />
                                                    <label
                                                        className="form-check-label line-height-1 fw-medium text-secondary-light"
                                                        htmlFor={`switch-${banner.id}`}
                                                    >
                                                        {banner.is_active ? 'Active' : 'Non Active'}
                                                    </label>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <button type="button" className="text-success-600 text-xl" onClick={() => openEditModal(banner)}>
                                                        <div className="mt-2">
                                                            <i className="ri-edit-line" />
                                                        </div>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="text-danger-600 remove-btn text-xl"
                                                        onClick={() => openDeleteModal(banner.id)}
                                                    >
                                                        <div className="mt-2">
                                                            <i className="ri-delete-bin-6-line" />
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-secondary-light m-0 text-center">Tidak ada banner yang tersedia</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Add */}
                <div className="modal fade" id="exampleModalAdd" tabIndex={-1} aria-labelledby="exampleModalAddLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-header border-top-0 border-start-0 border-end-0 border px-24 py-16">
                                <h1 className="modal-title fs-5" id="exampleModalAddLabel">
                                    Upload Image Banner
                                </h1>
                                <button type="button" className="btn-close" onClick={closeAddModal} />
                            </div>
                            <div className="modal-body p-24">
                                <form onSubmit={handleSubmit}>
                                    {errors.banner_image && <div className="alert alert-danger mb-3">{errors.banner_image}</div>}

                                    <div className="upload-image-wrapper m-auto gap-3">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <label
                                                className="upload-file input-form-light radius-8 bg-hover-neutral-200 d-flex align-items-center flex-column justify-content-center gap-1 overflow-hidden border border-dashed bg-neutral-50 p-5"
                                                htmlFor="upload-file"
                                                style={{ minHeight: '200px', cursor: 'pointer', width: '100%' }}
                                            >
                                                {previewImage ? (
                                                    <div className="d-flex align-items-center justify-content-center h-100 w-100">
                                                        <img
                                                            src={previewImage}
                                                            alt="Preview"
                                                            className="img-fluid object-fit-cover"
                                                            style={{ maxHeight: '180px', maxWidth: '100%' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            aria-hidden="true"
                                                            role="img"
                                                            className="iconify iconify--solar text-secondary-light text-xl"
                                                            width="1em"
                                                            height="1em"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                fillRule="evenodd"
                                                                d="M7.598 4.487c.267-1.31 1.433-2.237 2.768-2.237h3.268c1.335 0 2.5.927 2.768 2.237a.656.656 0 0 0 .62.524h.033c1.403.062 2.481.234 3.381.825c.567.372 1.055.85 1.435 1.409c.473.694.681 1.492.781 2.456c.098.943.098 2.124.098 3.62v.085c0 1.496 0 2.678-.098 3.62c-.1.964-.308 1.762-.781 2.457a5.2 5.2 0 0 1-1.435 1.409c-.703.461-1.51.665-2.488.762c-.958.096-2.159.096-3.685.096H9.737c-1.526 0-2.727 0-3.685-.096c-.978-.097-1.785-.3-2.488-.762a5.2 5.2 0 0 1-1.435-1.41c-.473-.694-.681-1.492-.781-2.456c-.098-.942-.098-2.124-.098-3.62v-.085c0-1.496 0-2.677.098-3.62c.1-.964.308-1.762.781-2.456a5.2 5.2 0 0 1 1.435-1.41c.9-.59 1.978-.762 3.381-.823l.017-.001h.016a.656.656 0 0 0 .62-.524m2.768-.737c-.64 0-1.177.443-1.298 1.036c-.195.96-1.047 1.716-2.072 1.725c-1.348.06-2.07.225-2.61.579a3.7 3.7 0 0 0-1.017.999c-.276.405-.442.924-.53 1.767c-.088.856-.089 1.96-.089 3.508s0 2.651.09 3.507c.087.843.253 1.362.53 1.768c.268.394.613.734 1.017.999c.417.273.951.438 1.814.524c.874.087 2 .088 3.577.088h4.444c1.576 0 2.702 0 3.577-.088c.863-.086 1.397-.25 1.814-.524c.404-.265.75-.605 1.018-1c.276-.405.442-.924.53-1.767c.088-.856.089-1.96.089-3.507s0-2.652-.09-3.508c-.087-.843-.253-1.362-.53-1.767a3.7 3.7 0 0 0-1.017-1c-.538-.353-1.26-.518-2.61-.578c-1.024-.01-1.876-.764-2.071-1.725a1.314 1.314 0 0 0-1.298-1.036zm1.634 7a2.25 2.25 0 1 0 0 4.5a2.25 2.25 0 0 0 0-4.5M8.25 13a3.75 3.75 0 1 1 7.5 0a3.75 3.75 0 0 1-7.5 0m9-3a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                        <span className="fw-semibold text-secondary-light">Upload</span>
                                                    </>
                                                )}
                                            </label>
                                            <input
                                                id="upload-file"
                                                type="file"
                                                hidden={true}
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                key={`add-input-${Date.now()}`}
                                            />
                                        </div>
                                        {previewImage && <div className="small mt-2 text-center text-muted">Preview gambar siap untuk diupload</div>}
                                        {previewImage && (
                                            <div className="d-flex justify-content-center mt-3">
                                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={openCropModal}>
                                                    <i className="ri-crop-line me-2"></i>
                                                    Crop Image
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer border-0">
                                        <button type="button" className="btn btn-secondary me-2" onClick={closeAddModal}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? 'Saving...' : 'Save Banner'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Edit */}
                <div className="modal fade" id="exampleModalEdit" tabIndex={-1} aria-labelledby="exampleModalEditLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-header border-top-0 border-start-0 border-end-0 border px-24 py-16">
                                <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                                    Edit Image Banner
                                </h1>
                                <button type="button" className="btn-close" onClick={closeEditModal} />
                            </div>
                            <div className="modal-body p-24">
                                {editingBanner && (
                                    <form onSubmit={handleEditSubmit}>
                                        {editErrors.banner_image && <div className="alert alert-danger mb-3">{editErrors.banner_image}</div>}

                                        <div className="upload-image-wrapper m-auto gap-3">
                                            <label
                                                htmlFor="edit-upload-file"
                                                className="upload-file input-form-light radius-8 d-flex align-items-center justify-content-center overflow-hidden border border-dashed bg-neutral-50 p-5"
                                                style={{ minHeight: '200px', cursor: 'pointer' }}
                                            >
                                                <div className="d-flex align-items-center justify-content-center h-100 w-100">
                                                    <img
                                                        src={editPreviewImage || editingBanner.full_image_url}
                                                        alt="Banner Preview"
                                                        className="img-fluid object-fit-cover"
                                                        style={{ maxHeight: '180px', maxWidth: '100%' }}
                                                    />
                                                </div>
                                            </label>
                                            <input
                                                id="edit-upload-file"
                                                type="file"
                                                hidden={true}
                                                accept="image/*"
                                                onChange={handleEditImageChange}
                                                key={`edit-input-${editingBanner?.id || Date.now()}`}
                                            />
                                        </div>

                                        <div className="mt-2 text-center text-muted">Klik gambar untuk mengganti</div>

                                        {editPreviewImage && (
                                            <div className="d-flex justify-content-center mt-3">
                                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={openEditCropModal}>
                                                    <i className="ri-crop-line me-2"></i>
                                                    Crop Image
                                                </button>
                                            </div>
                                        )}

                                        <div className="modal-footer mt-3 border-0">
                                            <button type="button" className="btn btn-secondary me-2" onClick={closeEditModal}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary" disabled={editProcessing}>
                                                {editProcessing ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal delete */}
                <div className="modal fade" id="exampleModalDelete" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-sm modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-body p-24 text-center">
                                <span className="fs-1 line-height-1 text-danger mb-16">
                                    <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                                </span>
                                <h6 className="fw-semibold text-primary-light mb-0 text-lg">Are you sure you want to delete this image?</h6>
                                <div className="d-flex align-items-center justify-content-center mt-24 gap-3">
                                    <button
                                        type="button"
                                        className="btn btn-danger-outline border-danger-600 bg-hover-danger-200 text-danger-600 text-md radius-8 border px-32 py-12"
                                        onClick={closeDeleteModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary border-primary-600 text-md radius-8 w-50 border px-24 py-12"
                                        onClick={() => {
                                            if (bannerToDelete) {
                                                handleDeleteBanner(String(bannerToDelete));
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Crop Modal for Add */}
                <div className="modal fade" id="cropModal" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-header border-top-0 border-start-0 border-end-0 border px-24 py-16">
                                <h1 className="modal-title fs-5">Crop Image</h1>
                                <button type="button" className="btn-close" onClick={cancelCrop} />
                            </div>
                            <div className="modal-body p-24">
                                {selectedImageForCrop && (
                                    <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={16 / 9}>
                                        <img ref={imgRef} src={selectedImageForCrop} alt="Crop" onLoad={onImageLoad} style={{ maxWidth: '100%' }} />
                                    </ReactCrop>
                                )}
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-secondary me-2" onClick={cancelCrop}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={applyCrop} disabled={!completedCrop}>
                                        Apply Crop
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Crop Modal for Edit */}
                <div className="modal fade" id="editCropModal" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-header border-top-0 border-start-0 border-end-0 border px-24 py-16">
                                <h1 className="modal-title fs-5">Crop Image</h1>
                                <button type="button" className="btn-close" onClick={cancelEditCrop} />
                            </div>
                            <div className="modal-body p-24">
                                {editSelectedImageForCrop && (
                                    <ReactCrop
                                        crop={editCrop}
                                        onChange={(c) => setEditCrop(c)}
                                        onComplete={(c) => setEditCompletedCrop(c)}
                                        aspect={16 / 9}
                                    >
                                        <img
                                            ref={editImgRef}
                                            src={editSelectedImageForCrop}
                                            alt="Crop"
                                            onLoad={onEditImageLoad}
                                            style={{ maxWidth: '100%' }}
                                        />
                                    </ReactCrop>
                                )}
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-secondary me-2" onClick={cancelEditCrop}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={applyEditCrop} disabled={!editCompletedCrop}>
                                        Apply Crop
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

export default Dashboard;
