import { UserData } from '@/admin/types';
import { Icon } from '@iconify/react/dist/iconify.js';
import { router, usePage } from '@inertiajs/react';
import * as bootstrap from 'bootstrap';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

const LatestRegisteredOne = ({ users }: { users: UserData[] }) => {
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [userToEdit, setUserToEdit] = useState<UserData | null>(null);
    const [userToResetPassword, setUserToResetPassword] = useState<UserData | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
    const [resetPasswordProcessing, setResetPasswordProcessing] = useState(false);
    const resetPasswordModalRef = useRef<bootstrap.Modal | null>(null);
    const { flash } = usePage().props;
    const typedFlash = flash as { success?: { message: string; id: string }; error?: string };
    useEffect(() => {
        if (typedFlash.success) {
            Swal.fire({
                title: 'Success',
                text: typedFlash.success.message,
                icon: 'success',
                confirmButtonText: 'OK',
            });
        }
    }, [typedFlash.success?.id]);

    useEffect(() => {
        const resetPasswordModalEl = document.getElementById('exampleModalResetPassword');
        if (resetPasswordModalEl) {
            resetPasswordModalRef.current = new bootstrap.Modal(resetPasswordModalEl, { backdrop: 'static', keyboard: false });
        }
        return () => resetPasswordModalRef.current?.dispose();
    }, []);

    const openResetPasswordModal = (user: UserData) => {
        setUserToResetPassword(user);
        setNewPassword('');
        setConfirmPassword('');
        setResetPasswordError(null);
        resetPasswordModalRef.current?.show();
    };

    const closeResetPasswordModal = () => {
        resetPasswordModalRef.current?.hide();
    };

    const handleResetPassword = () => {
        if (!userToResetPassword) return;

        if (newPassword.length < 8) {
            setResetPasswordError('Password minimal 8 karakter.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setResetPasswordError('Konfirmasi password tidak cocok.');
            return;
        }

        setResetPasswordProcessing(true);
        router.patch(
            `/admin/users/${userToResetPassword.id}/reset-password`,
            { password: newPassword, password_confirmation: confirmPassword },
            {
                preserveScroll: true,
                onSuccess: () => {
                    resetPasswordModalRef.current?.hide();
                    setUserToResetPassword(null);
                    setNewPassword('');
                    setConfirmPassword('');
                },
                onError: (errors) => {
                    setResetPasswordError(errors.password || 'Gagal mereset password.');
                },
                onFinish: () => setResetPasswordProcessing(false),
            },
        );
    };

    const handleDeleteUser = (userId: string) => {
        router.delete(`/admin/users/${userId}`, {
            preserveScroll: true,
            onSuccess: () => {
                
            },
            onError: (error) => {
                console.error(`Failed to delete user with ID ${userId}:`, error);
            },
        });
    };

    const handleEditUser = (user: UserData) => {
        setUserToEdit(user);
    };

    // eslint-disable-next-line react/prop-types
    const DatePicker = ({
        id,
        placeholder,
        className,
        value,
        onChange,
        disabled = false,
        style,
    }: {
        id: string;
        placeholder?: string;
        className?: string;
        value?: string;
        onChange: (date: string) => void;
        disabled?: boolean;
        style?: React.CSSProperties;
    }) => {
        const datePickerRef = useRef<HTMLInputElement>(null);
        useEffect(() => {
            if (datePickerRef.current) {
                const fp = flatpickr(datePickerRef.current, {
                    enableTime: true,
                    dateFormat: 'Y/m/d',
                    defaultDate: value,
                    onChange: (selectedDates, dateStr) => {
                        if (selectedDates.length > 0) {
                            // Format tanggal ke 'Y-m-d' untuk dikirim ke state/database
                            const formattedDateForDB = flatpickr.formatDate(selectedDates[0], 'Y-m-d');
                            onChange(formattedDateForDB); // Kirim tanggal dengan format yang benar
                        } else {
                            onChange(''); // Handle jika input dikosongkan
                        }
                    },
                });
                return () => {
                    fp.destroy();
                };
            }
        }, [value, onChange]);

        return (
            <input
                ref={datePickerRef}
                id={id}
                type="text"
                className={className}
                placeholder={placeholder}
                value={value}
                readOnly
                disabled={disabled}
                style={style}
            />
        );
    };
    return (
        <div className="col-xxl-12 col-xl-12">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="tab-content" id="pills-tabContent ">
                        <div
                            className="tab-pane fade show active"
                            id="pills-to-do-list"
                            role="tabpanel"
                            aria-labelledby="pills-to-do-list-tab"
                            tabIndex={0}
                        >
                            <div className="table-responsive scroll-sm">
                                <table className="bordered-table sm-table mb-0 table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Users </th>
                                            <th scope="col">Role </th>
                                            <th scope="col">Birth Place</th>
                                            <th scope="col">Birth Date</th>
                                            <th scope="col">WhatsApp Number</th>
                                            <th scope="col">Address</th>
                                            <th scope="col" className="text-center">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src="/assets/admin/images/users/user1.png"
                                                            alt="WowDash React Vite"
                                                            className="w-40-px h-40-px rounded-circle me-12 flex-shrink-0 overflow-hidden"
                                                        />
                                                        <div className="flex-grow-1">
                                                            <h6 className="text-md fw-medium mb-0">{user.name}</h6>
                                                            <span className="text-secondary-light fw-medium text-sm">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{user.role}</td>
                                                <td>{user.birth_place}</td>
                                                <td>
                                                    {new Date(user.birth_date).toLocaleDateString('en-US', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </td>
                                                <td>{user.whatsapp_number}</td>
                                                <td className="text-truncate" style={{ maxWidth: '150px' }}>
                                                    {user.address}
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-inline-flex align-items-center gap-12">
                                                        <button
                                                            type="button"
                                                            className="text-primary-600 text-xl"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#exampleModalView"
                                                            onClick={() => handleEditUser(user)}
                                                        >
                                                            <i className="ri-eye-line" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="text-success-600 text-xl"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#exampleModalEdit"
                                                            onClick={() => handleEditUser(user)}
                                                        >
                                                            <i className="ri-edit-line" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="text-warning-600 text-xl"
                                                            onClick={() => openResetPasswordModal(user)}
                                                            title="Reset Password"
                                                        >
                                                            <i className="ri-key-2-line" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="text-danger-600 remove-btn text-xl"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#exampleModalDelete"
                                                            onClick={() => setUserToDelete(user.id)}
                                                        >
                                                            <i className="ri-delete-bin-6-line" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Modal View */}
                                <div
                                    className="modal fade"
                                    id="exampleModalView"
                                    tabIndex={-1}
                                    aria-labelledby="exampleModalViewLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                                        <div className="modal-content radius-16 bg-base">
                                            <div className="modal-header border-top-0 border-start-0 border-end-0 border px-24 py-16">
                                                <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                                                    View User
                                                </h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                            </div>
                                            <div className="modal-body p-24">
                                                <form action="#">
                                                    <div className="row">
                                                        <div className="col-6 mb-20">
                                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Name : </label>
                                                            <input type="text" className="form-control radius-8" value={userToEdit?.name} disabled />
                                                        </div>
                                                        <div className="col-6 mb-20">
                                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Email : </label>
                                                            <input
                                                                type="email"
                                                                className="form-control radius-8"
                                                                value={userToEdit?.email}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="col-6 mb-20">
                                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Role : </label>
                                                            <select
                                                                className="form-select"
                                                                aria-label="Default select example"
                                                                value={userToEdit?.role || 'user'}
                                                                disabled
                                                            >
                                                                <option value="user">User</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-6 mb-20">
                                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">
                                                                WhatsApp Number :{' '}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control radius-8"
                                                                value={userToEdit?.whatsapp_number}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="col-6 mb-20">
                                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">
                                                                Birth Place :{' '}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control radius-8"
                                                                value={userToEdit?.birth_place}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-20">
                                                            <label
                                                                htmlFor="editstartDate"
                                                                className="form-label fw-semibold text-primary-light mb-8 text-sm"
                                                            >
                                                                Birth Date :{' '}
                                                            </label>
                                                            <div className="position-relative">
                                                                <DatePicker
                                                                    className="form-control radius-8"
                                                                    style={{ backgroundColor: '#e9ecef' }}
                                                                    id="startDate"
                                                                    value={userToEdit?.birth_date || ''}
                                                                    onChange={(dateStr) =>
                                                                        setUserToEdit((prev) => (prev ? { ...prev, birth_date: dateStr } : null))
                                                                    }
                                                                    disabled={true}
                                                                />
                                                                <span className="position-absolute translate-middle-y line-height-1 end-0 top-50 me-12">
                                                                    <Icon icon="solar:calendar-linear" className="icon text-lg" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 mb-20">
                                                            <label htmlFor="desc" className="form-label fw-semibold text-primary-light mb-8 text-sm">
                                                                Address
                                                            </label>
                                                            <textarea
                                                                className="form-control"
                                                                id="editdesc"
                                                                rows={4}
                                                                cols={50}
                                                                placeholder="Write some text"
                                                                defaultValue={userToEdit?.address}
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Modal Edit Event */}
                                <div
                                    className="modal fade"
                                    id="exampleModalEdit"
                                    tabIndex={-1}
                                    aria-labelledby="exampleModalEditLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                                        <div className="modal-content radius-16 bg-base">
                                            <div className="modal-header border-top-0 border-start-0 border-end-0 border px-24 py-16">
                                                <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                                                    Edit User
                                                </h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                            </div>
                                            <div className="modal-body p-24">
                                                <form action="#">
                                                    <div className="row">
                                                        <div className="col-6 mb-20">
                                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Name : </label>
                                                            <input
                                                                type="text"
                                                                className="form-control radius-8"
                                                                value={userToEdit?.name}
                                                                onChange={(e) =>
                                                                    setUserToEdit((prev) => (prev ? { ...prev, name: e.target.value } : null))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-6 mb-20">
                                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Email : </label>
                                                            <input
                                                                type="email"
                                                                className="form-control radius-8"
                                                                value={userToEdit?.email}
                                                                onChange={(e) =>
                                                                    setUserToEdit((prev) => (prev ? { ...prev, email: e.target.value } : null))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-6 mb-20">
                                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Role : </label>
                                                            <select
                                                                className="form-select"
                                                                aria-label="Default select example"
                                                                value={userToEdit?.role || 'user'}
                                                                onChange={(e) =>
                                                                    setUserToEdit((prev) =>
                                                                        prev ? { ...prev, role: e.target.value as 'user' | 'admin' } : null,
                                                                    )
                                                                }
                                                            >
                                                                <option value="user">User</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-6 mb-20">
                                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">
                                                                WhatsApp Number :{' '}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control radius-8"
                                                                value={userToEdit?.whatsapp_number}
                                                                onChange={(e) =>
                                                                    setUserToEdit((prev) =>
                                                                        prev ? { ...prev, whatsapp_number: e.target.value } : null,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-6 mb-20">
                                                            <label className="form-label fw-semibold text-primary-light mb-8 text-sm">
                                                                Birth Place :{' '}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control radius-8"
                                                                value={userToEdit?.birth_place}
                                                                onChange={(e) =>
                                                                    setUserToEdit((prev) => (prev ? { ...prev, birth_place: e.target.value } : null))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-20">
                                                            <label
                                                                htmlFor="editstartDate"
                                                                className="form-label fw-semibold text-primary-light mb-8 text-sm"
                                                            >
                                                                Birth Date :{' '}
                                                            </label>
                                                            <div className="position-relative">
                                                                <DatePicker
                                                                    className="form-control radius-8 bg-base"
                                                                    id="startDate"
                                                                    value={userToEdit?.birth_date || ''}
                                                                    onChange={(dateStr) =>
                                                                        setUserToEdit((prev) => (prev ? { ...prev, birth_date: dateStr } : null))
                                                                    }
                                                                />
                                                                <span className="position-absolute translate-middle-y line-height-1 end-0 top-50 me-12">
                                                                    <Icon icon="solar:calendar-linear" className="icon text-lg" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 mb-20">
                                                            <label htmlFor="desc" className="form-label fw-semibold text-primary-light mb-8 text-sm">
                                                                Address
                                                            </label>
                                                            <textarea
                                                                className="form-control"
                                                                id="editdesc"
                                                                rows={4}
                                                                cols={50}
                                                                placeholder="Write some text"
                                                                defaultValue={userToEdit?.address}
                                                                onChange={(e) =>
                                                                    setUserToEdit((prev) => (prev ? { ...prev, address: e.target.value } : null))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-center mt-24 gap-3">
                                                            <button
                                                                type="reset"
                                                                className="border-danger-600 bg-hover-danger-200 text-danger-600 text-md radius-8 border px-40 py-11"
                                                                data-bs-dismiss="modal"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className="btn btn-primary border-primary-600 text-md radius-8 border px-24 py-12"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (userToEdit) {
                                                                        router.put(
                                                                            `/admin/users/${userToEdit.id}`,
                                                                            { ...userToEdit },
                                                                            {
                                                                                onSuccess: () => {
                                                                                    console.log('User updated successfully!');
                                                                                },
                                                                                onError: (errors) => {
                                                                                    console.error('Update failed:', errors);
                                                                                },
                                                                            },
                                                                        );
                                                                    }
                                                                }}
                                                                data-bs-dismiss="modal"
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Modal delete */}
                                <div className="modal fade" id="exampleModalDelete" tabIndex={-1} aria-hidden="true">
                                    <div className="modal-dialog modal-sm modal-dialog modal-dialog-centered">
                                        <div className="modal-content radius-16 bg-base">
                                            <div className="modal-body p-24 text-center">
                                                <span className="fs-1 line-height-1 text-danger mb-16">
                                                    <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                                                </span>
                                                <h6 className="fw-semibold text-primary-light mb-0 text-lg">
                                                    Are your sure you want to delete this event
                                                </h6>
                                                <div className="d-flex align-items-center justify-content-center mt-24 gap-3">
                                                    <button
                                                        type="reset"
                                                        className="btn btn-danger-outline border-danger-600 bg-hover-danger-200 text-danger-600 text-md radius-8 border px-32 py-12"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary border-primary-600 text-md radius-8 w-50 border px-24 py-12"
                                                        onClick={() => {
                                                            if (userToDelete) {
                                                                handleDeleteUser(userToDelete);
                                                            }
                                                        }}
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Modal Reset Password */}
                                <div
                                    className="modal fade"
                                    id="exampleModalResetPassword"
                                    tabIndex={-1}
                                    aria-labelledby="exampleModalResetPasswordLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content radius-16 bg-base">
                                            <div className="modal-header border-top-0 border-start-0 border-end-0 border px-24 py-16">
                                                <h1 className="modal-title fs-5" id="exampleModalResetPasswordLabel">
                                                    Reset Password
                                                </h1>
                                                <button type="button" className="btn-close" onClick={closeResetPasswordModal} />
                                            </div>
                                            <div className="modal-body p-24">
                                                <p className="text-secondary-light mb-16">
                                                    Atur ulang password untuk <strong>{userToResetPassword?.name}</strong> (
                                                    {userToResetPassword?.email})
                                                </p>
                                                {resetPasswordError && <div className="alert alert-danger mb-16">{resetPasswordError}</div>}
                                                <div className="mb-20">
                                                    <label className="form-label fw-semibold text-primary-light mb-8 text-sm">
                                                        Password Baru
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="form-control radius-8"
                                                        placeholder="Minimal 8 karakter"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-20">
                                                    <label className="form-label fw-semibold text-primary-light mb-8 text-sm">
                                                        Konfirmasi Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="form-control radius-8"
                                                        placeholder="Ulangi password baru"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center mt-24 gap-3">
                                                    <button
                                                        type="button"
                                                        className="border-danger-600 bg-hover-danger-200 text-danger-600 text-md radius-8 border px-40 py-11"
                                                        onClick={closeResetPasswordModal}
                                                    >
                                                        Batal
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary border-primary-600 text-md radius-8 border px-24 py-12"
                                                        onClick={handleResetPassword}
                                                        disabled={resetPasswordProcessing}
                                                    >
                                                        {resetPasswordProcessing ? 'Menyimpan...' : 'Reset Password'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="pills-recent-leads" role="tabpanel" aria-labelledby="pills-recent-leads-tab" tabIndex={0}>
                            <div className="table-responsive scroll-sm">
                                <table className="bordered-table sm-table mb-0 table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Users </th>
                                            <th scope="col">Registered On</th>
                                            <th scope="col">Plan</th>
                                            <th scope="col" className="text-center">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    {/* <tbody>
                                        {users.map((user, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src="/assets/images/users/user1.png"
                                                            alt="WowDash React Vite"
                                                            className="w-40-px h-40-px rounded-circle me-12 flex-shrink-0 overflow-hidden"
                                                        />
                                                        <div className="flex-grow-1">
                                                            <h6 className="text-md fw-medium mb-0">{user.name}</h6>
                                                            <span className="text-secondary-light fw-medium text-sm">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>27 Mar 2024</td>
                                                <td>Free</td>
                                                <td className="text-center">
                                                    <span className="bg-success-focus text-success-main rounded-pill fw-medium px-24 py-4 text-sm">
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody> */}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestRegisteredOne;
