'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function RedirectPage() {
    const params = useParams();
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const redirectToOriginalUrl = async () => {
            try {
                const shortCode = params.shortCode as string;

                // TODO: Reemplazar con tu URL de API Gateway para redirección
                const API_URL = process.env.NEXT_PUBLIC_REDIRECT_API_URL || '';

                const response = await fetch(`${API_URL}/${shortCode}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'URL no encontrada');
                }

                // Redirigir a la URL original
                window.location.href = data.originalUrl;

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
                setLoading(false);
            }
        };

        redirectToOriginalUrl();
    }, [params.shortCode, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-slate-300 text-lg">Redirigiendo...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700 text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-red-500"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            URL no encontrada
                        </h1>
                        <p className="text-slate-400">{error}</p>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return null;
}