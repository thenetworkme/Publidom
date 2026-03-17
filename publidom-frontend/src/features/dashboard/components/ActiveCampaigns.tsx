import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Campaign } from "@/types/campaign";
import { BadgeCheck, X } from "lucide-react";
import { VideoSubmissionModal } from "@/components/ui/VideoSubmissionModal";

// Helper to format time ago
function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Ahora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// Social Icons Components
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

// Campaign Details Modal with Participation Logic
function CampaignModal({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
    const [isParticipating, setIsParticipating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Parse requirements - can be string (JSON) or already an array
    let requirements: string[] = [];
    if (campaign.requirements) {
        if (Array.isArray(campaign.requirements)) {
            requirements = campaign.requirements;
        } else if (typeof campaign.requirements === 'string') {
            try {
                const parsed = JSON.parse(campaign.requirements);
                requirements = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
            } catch {
                requirements = [campaign.requirements];
            }
        }
    }

    // Check participation status on mount
    useEffect(() => {
        const checkParticipation = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/campaigns/${campaign.id}/participation-status`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );
                const data = await response.json();
                setIsParticipating(data.isParticipating);
            } catch (err) {
                console.error('Error checking participation:', err);
            } finally {
                setIsLoading(false);
            }
        };
        checkParticipation();
    }, [campaign.id]);

    // Join campaign
    const handleJoinCampaign = async () => {
        setIsJoining(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/campaigns/${campaign.id}/join`,
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al unirse a la campaña');
            }

            setIsParticipating(true);
            // Redirect to add-clips page
            window.location.href = '/add-clips';

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsJoining(false);
        }
    };

    // Handle video submission success
    const handleSubmissionSuccess = () => {
        setShowVideoModal(false);
        // Optionally refresh or show success message
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop - Transparent, just for click-outside-to-close */}
                <div
                    className="absolute inset-0"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content */}
                    <div className="pt-8 px-6 pb-6 overflow-y-auto max-h-[85vh]">
                        {/* Avatar centered at top */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600">
                                <div className="w-full h-full rounded-full bg-white p-[2px]">
                                    {campaign.image_url ? (
                                        <img
                                            src={campaign.image_url}
                                            alt={campaign.title}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                                            {campaign.title.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-4">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-gray-900">{campaign.title}</h2>
                                <BadgeCheck className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-sm text-gray-400">{timeAgo(campaign.created_at)}</p>
                            {isParticipating && (
                                <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Inscrito
                                </span>
                            )}
                        </div>

                        {/* Price - Using cost_per_1k_views if available, fallback to budget */}
                        {(campaign.cost_per_1k_views && campaign.cost_per_1k_views > 0) || (campaign.budget && campaign.budget > 0) ? (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 text-center">Recompensa</p>
                                <div className="text-center">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        ${campaign.cost_per_1k_views || campaign.budget?.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-400 ml-2">
                                        {campaign.cost_per_1k_views ? 'por 1K views' : 'presupuesto total'}
                                    </span>
                                </div>
                            </div>
                        ) : null}

                        {/* Description */}
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {campaign.description}
                            </p>
                        </div>

                        {/* Requirements */}
                        {requirements.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Requisitos</h3>
                                <ul className="space-y-2">
                                    {requirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Instructions Link */}
                        {campaign.instructions_url && (
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Instrucciones</h3>
                                <a
                                    href={campaign.instructions_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                                >
                                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    Ver instrucciones de la campaña
                                    <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        )}

                        {/* Social platforms */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Plataformas</h3>
                            <div className="flex gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                    <TikTokIcon className="w-4 h-4" />
                                    <span className="text-xs font-medium">TikTok</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                    <InstagramIcon className="w-4 h-4" />
                                    <span className="text-xs font-medium">Instagram</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                    <YouTubeIcon className="w-4 h-4" />
                                    <span className="text-xs font-medium">YouTube</span>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* CTA Button - Changes based on participation status */}
                        {isLoading ? (
                            <button disabled className="w-full py-3 bg-gray-200 text-gray-500 font-semibold rounded-xl">
                                Cargando...
                            </button>
                        ) : isParticipating ? (
                            <button
                                onClick={() => setShowVideoModal(true)}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Agregar Video
                            </button>
                        ) : (
                            <button
                                onClick={handleJoinCampaign}
                                disabled={isJoining}
                                className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {isJoining ? 'Uniéndose...' : 'Participar en campaña'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Submission Modal */}
            {showVideoModal && (
                <VideoSubmissionModal
                    isOpen={showVideoModal}
                    onClose={() => setShowVideoModal(false)}
                    campaignId={campaign.id}
                    campaignTitle={campaign.title}
                    onSubmitSuccess={handleSubmissionSuccess}
                />
            )}
        </>
    );
}

// Campaign Card Component
function CampaignCard({ campaign, onClick }: { campaign: Campaign; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
        >
            {/* Header: Avatar + Brand Info */}
            <div className="flex items-start gap-3 mb-3">
                {/* Avatar with gradient border */}
                <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600">
                        <div className="w-full h-full rounded-full bg-white p-[2px]">
                            {campaign.image_url ? (
                                <img
                                    src={campaign.image_url}
                                    alt={campaign.title}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                    {campaign.title.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Brand name and meta */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900 truncate text-sm">
                            {campaign.title.split(' ')[0]}
                        </span>
                        <BadgeCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-400">
                        {timeAgo(campaign.created_at)} • Per view
                    </p>
                </div>
            </div>

            {/* Campaign Title */}
            <h3 className="font-medium text-gray-800 text-sm mb-3 line-clamp-2">
                {campaign.title}
            </h3>

            {/* Footer: Social Icons + Price */}
            <div className="flex items-center justify-between">
                {/* Social Icons */}
                <div className="flex items-center gap-2">
                    <TikTokIcon className="w-4 h-4 text-gray-500" />
                    <InstagramIcon className="w-4 h-4 text-gray-500" />
                    <YouTubeIcon className="w-4 h-4 text-gray-500" />
                </div>

                {/* Price */}
                {campaign.budget && campaign.budget > 0 && (
                    <div className="text-right">
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${campaign.budget.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Per 1M views
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export function ActiveCampaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setCampaigns(data);
            }
            setLoading(false);
        };

        fetchCampaigns();
    }, []);

    if (loading) {
        return (
            <div className="space-y-3 max-w-sm">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-2xl h-28 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold tracking-tight">Campañas activas</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    Selecciona una campaña para ver detalles
                </p>
            </div>

            {campaigns.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 flex min-h-[180px] items-center justify-center max-w-sm">
                    <div className="flex flex-col items-center gap-3 text-center p-6">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">No hay campañas activas</h3>
                        <p className="text-xs text-gray-400 max-w-[180px]">
                            Vuelve pronto para ver nuevas campañas.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3 max-w-sm">
                    {campaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            campaign={campaign}
                            onClick={() => setSelectedCampaign(campaign)}
                        />
                    ))}
                </div>
            )}

            {/* Campaign Details Modal */}
            {selectedCampaign && (
                <CampaignModal
                    campaign={selectedCampaign}
                    onClose={() => setSelectedCampaign(null)}
                />
            )}
        </div>
    );
}

