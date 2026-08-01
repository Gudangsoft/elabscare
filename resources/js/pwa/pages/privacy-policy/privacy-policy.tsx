import { ChevronLeft, Shield, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PrivacyPolicyProps {
    privacy: {
        key: string;
        value: string; 
    } | null;
}

export default function PrivacyPolicy({ privacy }: PrivacyPolicyProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for better UX
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleBack = () => {
        window.history.back();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-center">Memuat kebijakan privasi...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 relative overflow-hidden">

                {/* Main Content */}
                <div className="relative z-10 px-4 pb-8 pt-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Privacy Policy Content */}
                            <div className="px-6 py-8">
                                {privacy && privacy.value ? (
                                    <>
                                        <style>{`
            .privacy-content h1 {
                font-size: 2.25rem !important; /* 36px */
                margin-bottom: 1.5rem !important;
                color: #0d9488 !important;
                border-bottom: 2px solid #99f6e4 !important;
                padding-bottom: 1rem !important;
                font-weight: 700 !important;
                line-height: 1.2 !important;
            }
            
            .privacy-content h2 {
                font-size: 1.5rem !important; /* 24px */
                margin-top: 2.5rem !important;
                margin-bottom: 1.25rem !important;
                color: #374151 !important;
                border-bottom: 1px solid #e5e7eb !important;
                padding-bottom: 0.75rem !important;
                font-weight: 700 !important;
            }
            
            .privacy-content h3 {
                font-size: 1.25rem !important; /* 20px */
                margin-top: 2rem !important;
                margin-bottom: 1rem !important;
                color: #374151 !important;
                font-weight: 600 !important;
            }
            
            .privacy-content p {
                color: #4b5563 !important;
                line-height: 1.75 !important;
                margin-bottom: 1rem !important;
                font-size: 1rem !important;
            }
            
            .privacy-content strong {
                color: #1f2937 !important;
                font-weight: 600 !important;
            }
            
            .privacy-content ul {
                list-style-type: disc !important;
                margin: 1.25rem 0 !important;
                padding-left: 1.5rem !important;
            }
            
            .privacy-content li {
                color: #4b5563 !important;
                margin: 0.75rem 0 !important;
                line-height: 1.75 !important;
            }
            
            .privacy-content hr {
                border-color: #e5e7eb !important;
                border-top-width: 2px !important;
            }
            
            .privacy-content a {
                color: #0d9488 !important;
                text-decoration: none !important;
                font-weight: 500 !important;
            }
            
            .privacy-content a:hover {
                text-decoration: underline !important;
            }
            
            .privacy-content br {
                display: block !important;
                margin: 0.5rem 0 !important;
                content: "" !important;
                height: 0.5rem !important;
            }
        `}</style>

                                        <div
                                            className="privacy-content"
                                            dangerouslySetInnerHTML={{
                                                __html: privacy.value
                                            }}
                                        />
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Kebijakan Privasi Tidak Tersedia</h3>
                                        <p className="text-gray-600">Konten kebijakan privasi sedang dalam proses pembaruan.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}