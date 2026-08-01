import Breadcrumb from '@/admin/components/Breadcrumb';
import { UserType } from '@/pwa/types/userType';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import MasterLayout from '../../layouts/MasterLayout';

interface ProfileProps {
    user: UserType;
}

type ProfileForm = {
    name: string;
    email: string;
    whatsapp_number: string;
    birth_place: string;
    birth_date: string;
    gender: string;
    address: string;
    avatar: File | null;
    _method: 'patch';
};

const Profile = ({ user }: ProfileProps) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<ProfileForm>({
        name: user.name ?? '',
        email: user.email ?? '',
        whatsapp_number: user.whatsapp_number ?? '',
        birth_place: user.birth_place ?? '',
        birth_date: user.birth_date ? user.birth_date.slice(0, 10) : '',
        gender: user.gender ?? 'male',
        address: user.address ?? '',
        avatar: null,
        _method: 'patch',
    });

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }

        setData('avatar', file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('profile.settings.update-profile'), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    title: 'Berhasil',
                    text: 'Profil berhasil diperbarui',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            },
        });
    };

    return (
        <MasterLayout user={user}>
            <Breadcrumb title="Profil Saya" />

            <div className="col-xxl-12 col-xl-12">
                <div className="card h-100">
                    <div className="card-body p-24">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-24 d-flex align-items-center gap-4">
                                <img
                                    src={previewImage || (user.avatar ? `/storage/${user.avatar}` : '/assets/admin/images/avatar/default-avatar.png')}
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ objectFit: 'cover', height: '80px', width: '80px' }}
                                />
                                <div>
                                    <label htmlFor="avatar-upload" className="btn btn-outline-primary btn-sm radius-8 mb-0">
                                        Ganti Foto
                                    </label>
                                    <input id="avatar-upload" type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                                    {errors.avatar && <div className="text-danger text-sm mt-1">{errors.avatar}</div>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6 mb-20">
                                    <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Nama</label>
                                    <input
                                        type="text"
                                        className="form-control radius-8"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <div className="text-danger text-sm mt-1">{errors.name}</div>}
                                </div>
                                <div className="col-6 mb-20">
                                    <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Email</label>
                                    <input
                                        type="email"
                                        className="form-control radius-8"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <div className="text-danger text-sm mt-1">{errors.email}</div>}
                                </div>
                                <div className="col-6 mb-20">
                                    <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Nomor WhatsApp</label>
                                    <input
                                        type="text"
                                        className="form-control radius-8"
                                        value={data.whatsapp_number}
                                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                                    />
                                    {errors.whatsapp_number && <div className="text-danger text-sm mt-1">{errors.whatsapp_number}</div>}
                                </div>
                                <div className="col-6 mb-20">
                                    <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Tempat Lahir</label>
                                    <input
                                        type="text"
                                        className="form-control radius-8"
                                        value={data.birth_place}
                                        onChange={(e) => setData('birth_place', e.target.value)}
                                    />
                                    {errors.birth_place && <div className="text-danger text-sm mt-1">{errors.birth_place}</div>}
                                </div>
                                <div className="col-6 mb-20">
                                    <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        className="form-control radius-8"
                                        value={data.birth_date}
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                    />
                                    {errors.birth_date && <div className="text-danger text-sm mt-1">{errors.birth_date}</div>}
                                </div>
                                <div className="col-6 mb-20">
                                    <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Jenis Kelamin</label>
                                    <select
                                        className="form-select radius-8"
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                    >
                                        <option value="male">Laki-laki</option>
                                        <option value="female">Perempuan</option>
                                    </select>
                                    {errors.gender && <div className="text-danger text-sm mt-1">{errors.gender}</div>}
                                </div>
                                <div className="col-12 mb-20">
                                    <label className="form-label fw-semibold text-primary-light mb-8 text-sm">Alamat</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                    {errors.address && <div className="text-danger text-sm mt-1">{errors.address}</div>}
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary radius-8 px-24" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default Profile;
