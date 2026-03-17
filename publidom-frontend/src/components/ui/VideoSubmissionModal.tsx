import { useState } from 'react';
import { X, Link2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VideoSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaignId: string;
    campaignTitle: string;
    onSubmitSuccess: () => void;
}

// Platform icons
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

/**
 * Detect platform from URL
 */
const detectPlatform = (url: string): 'youtube' | 'tiktok' | 'instagram' | null => {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            return 'youtube';
        }
        if (hostname.includes('tiktok.com')) {
            return 'tiktok';
        }
        if (hostname.includes('instagram.com')) {
            return 'instagram';
        }
        return null;
    } catch {
        return null;
    }
};

export function VideoSubmissionModal({
    isOpen,
    onClose,
    campaignId,
    campaignTitle,
    onSubmitSuccess
}: VideoSubmissionModalProps) {
    const [videoUrl, setVideoUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const detectedPlatform = videoUrl ? detectPlatform(videoUrl) : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!videoUrl.trim()) {
            setError('Por favor ingresa la URL del video');
            return;
        }

        if (!detectedPlatform) {
            setError('URL no válida. Debe ser de YouTube, TikTok o Instagram.');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    campaignId,
                    videoUrl
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar el video');
            }

            setSuccess(true);
            setTimeout(() => {
                onSubmitSuccess();
                onClose();
                setVideoUrl('');
                setSuccess(false);
            }, 1500);

        } catch (err: any) {
            setError(err.message || 'Error al enviar el video');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setVideoUrl('');
            setError(null);
            setSuccess(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Agregar Video</h2>
                        <p className="text-sm text-gray-500">{campaignTitle}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Platform Icons */}
                    <div className="flex items-center justify-center gap-4 py-2">
                        <div className={`p-3 rounded-xl transition-all ${detectedPlatform === 'tiktok' ? 'bg-black text-white scale-110' : 'bg-gray-100 text-gray-400'}`}>
                            <TikTokIcon className="w-6 h-6" />
                        </div>
                        <div className={`p-3 rounded-xl transition-all ${detectedPlatform === 'instagram' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110' : 'bg-gray-100 text-gray-400'}`}>
                            <InstagramIcon className="w-6 h-6" />
                        </div>
                        <div className={`p-3 rounded-xl transition-all ${detectedPlatform === 'youtube' ? 'bg-red-500 text-white scale-110' : 'bg-gray-100 text-gray-400'}`}>
                            <YouTubeIcon className="w-6 h-6" />
                        </div>
                    </div>

                    {/* URL Input */}
                    <div className="space-y-2">
                        <Label htmlFor="videoUrl">URL del Video</Label>
                        <div className="relative">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="videoUrl"
                                type="url"
                                value={videoUrl}
                                onChange={(e) => {
                                    setVideoUrl(e.target.value);
                                    setError(null);
                                }}
                                placeholder="https://www.youtube.com/shorts/..."
                                className="pl-10"
                                disabled={isSubmitting}
                            />
                        </div>
                        <p className="text-xs text-gray-400">
                            Pega el enlace de tu video de TikTok, Instagram Reels o YouTube Shorts
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            ¡Video enviado exitosamente!
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting || !videoUrl.trim() || success}
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enviando...
                            </>
                        ) : success ? (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                ¡Enviado!
                            </>
                        ) : (
                            'Enviar Video'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
