import TiptapEditor from '@/admin/components/TiptapEditor';
import MasterLayout from '@/admin/layouts/MasterLayout';
import { UserType } from '@/pwa/types/userType';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface PrivacyPolicy {
    value: string;
}

const PrivacyPolicy = ({ user, privacy }: { user: UserType; privacy: PrivacyPolicy }) => {
    const { data, setData, patch, processing, errors, wasSuccessful } = useForm({
        content: privacy.value,
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaveStatus('idle');

        patch(route('admin.privacy-policy.update'), {
            onSuccess: () => {
                setSaveStatus('saved');
                // Auto hide "saved" status after 3 seconds
                setTimeout(() => {
                    setSaveStatus('idle');
                }, 3000);
            },
            onError: () => {
                setSaveStatus('error');
                // Auto hide error status after 5 seconds
                setTimeout(() => {
                    setSaveStatus('idle');
                }, 5000);
            },
        });
    };

    // Alternative: Using wasSuccessful from Inertia
    useEffect(() => {
        if (wasSuccessful) {
            setSaveStatus('saved');
            const timer = setTimeout(() => {
                setSaveStatus('idle');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [wasSuccessful]);

    return (
        <MasterLayout user={user}>
            <h6 className="fw-semibold mb-24"> Privacy Policy</h6>
            <div className="col-xxl-12 col-xl-12">
                <div className="card h-100">
                    <div className="card-body p-24">
                        <form onSubmit={handleSubmit} className="p-6">
                            <TiptapEditor
                                content={data.content}
                                onChange={(data) => setData('content', data)}
                                placeholder="Start writing your amazing content..."
                                className="mb-4"
                            />

                            {errors.content && <p className="text-danger mt-2 text-xs">{errors.content}</p>}

                            <div className="d-flex align-items-center mt-4 gap-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary-600 radius-8 d-flex align-items-center mt-6 gap-2 px-18 py-8"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Save'}
                                    {processing && <span className="spinner-border spinner-border-sm ms-2" />}
                                </button>

                                {/* Save Status Indicator */}
                                {saveStatus === 'saved' && (
                                    <div className="d-flex align-items-center text-success animate__animated animate__fadeIn">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                                            <path
                                                d="M20 6L9 17L4 12"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <small className="fw-medium">Saved successfully!</small>
                                    </div>
                                )}

                                {saveStatus === 'error' && (
                                    <div className="d-flex align-items-center text-danger animate__animated animate__fadeIn">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-1">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                                            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                        <small className="fw-medium">Failed to save. Please try again.</small>
                                    </div>
                                )}
                            </div>

                            {/* Alternative: Simple text-only version */}
                            {/*
                            <div className="mt-4 d-flex align-items-center gap-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary-600 radius-8 mt-6 px-18 py-8"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Save'}
                                    {processing && <span className="spinner-border spinner-border-sm ms-2" />}
                                </button>

                                {saveStatus === 'saved' && (
                                    <span className="text-success fw-medium">
                                        ✓ Saved
                                    </span>
                                )}
                            </div>
                            */}
                        </form>
                    </div>
                </div>
            </div>

            {/* Optional: Add custom CSS for smoother animations */}
            <style>{`
                .animate__animated {
                    animation-duration: 0.3s;
                }

                .animate__fadeIn {
                    animation-name: fadeIn;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .save-status-indicator {
                    transition: all 0.3s ease;
                }
            `}</style>
        </MasterLayout>
    );
};

export default PrivacyPolicy;
