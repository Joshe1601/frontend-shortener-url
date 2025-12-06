'use client';

import {useEffect, useState} from 'react';

interface ShortenedUrl {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
}

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<ShortenedUrl[]>([]);

  // Se agregó este useEffect para detectar el path y redirigir
  useEffect(() => {
    const detectAndRedirect = async () => {
      const path = window.location.pathname.slice(1);
      console.log("Path detectado:", path);

      // Si hay un path y no es vacío, intentar redirigir
      if (path && path !== '') {
        setRedirecting(true);
        await redirectToUrl(path);
      }
    };

    detectAndRedirect();
  }, []);

  const redirectToUrl = async (shortCode: string) => {
    try {
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
      setError(err instanceof Error ? err.message : 'Error al redirigir');
      setRedirecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          ...(customCode && { customCode })
        }),
      });

      const body = await response.json();
      console.log("Respuesta cruda:", body);

      let data;
      if (typeof body.data === 'string') {
        data = JSON.parse(body.data);
      } else {
        data = body.data;
      }

      if (!response.ok) {
        throw new Error(body.error || 'Error al acortar la URL');
      }

      setHistory([data, ...history]);

      setUrl('');
      setCustomCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
        alert('URL copiada al portapapeles');
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  if (redirecting) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-300 text-lg">Redirigiendo...</p>
            {error && (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-400 text-sm mb-3">{error}</p>
                    <button
                        onClick={() => {
                          setRedirecting(false);
                          setError('');
                          window.history.pushState({}, '', '/');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Volver al inicio
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Acortador de URLs
            </h1>
            <p className="text-slate-400 text-lg">
              Transforma tus enlaces en URLs cortas y fáciles de compartir
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">
                  URL a acortar
                </label>
                <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://ejemplo.com/url-larga"
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="customCode" className="block text-sm font-medium text-slate-300 mb-2">
                  Código personalizado (opcional)
                </label>
                <input
                    type="text"
                    id="customCode"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="mi-codigo"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
              )}

              <button
                  type="submit"
                  disabled={loading || !url}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Acortando...' : 'Acortar URL'}
              </button>
            </form>
          </div>

          {/* Historial */}
          {history.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Historial</h2>
                {history.map((item, index) => (
                    <div
                        key={index}
                        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-700 hover:border-slate-600 transition"
                    >
                      <div className="flex flex-col space-y-4">
                        {/* URL Original */}
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            URL Original
                          </p>
                          <p className="text-slate-300 text-sm break-all">
                            {item.originalUrl}
                          </p>
                        </div>

                        {/* URL Acortada */}
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            URL Acortada
                          </p>
                          <div className="flex items-center gap-3">
                            <a
                                href={item.shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 font-medium break-all flex-1"
                            >
                              {item.shortUrl}
                            </a>
                            <button
                                onClick={() => copyToClipboard(item.shortUrl)}
                                className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                            >
                              Copiar
                            </button>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Código: {item.shortCode}</span>
                          <span>•</span>
                          <span>
                      Creado: {new Date(item.createdAt).toLocaleString('es-ES')}
                    </span>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}