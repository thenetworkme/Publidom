import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Campaign } from '@/types/campaign';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';

interface CampaignListProps {
    campaigns: Campaign[];
    onRefresh: () => void;
    onEdit: (campaign: Campaign) => void;
}

export function CampaignList({ campaigns, onRefresh, onEdit }: CampaignListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar esta campaña?')) return;

        setDeletingId(id);
        try {
            const { error } = await supabase
                .from('campaigns')
                .delete()
                .eq('id', id);

            if (error) throw error;
            onRefresh();
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error al eliminar campaña');
        } finally {
            setDeletingId(null);
        }
    };

    // Helper to format time ago
    const timeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Ahora';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    };

    return (
        <div className="space-y-3">
            {campaigns.map((campaign) => (
                <div
                    key={campaign.id}
                    className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                >
                    {/* Header: Avatar + Info + Badge */}
                    <div className="flex items-start gap-4">
                        {/* Avatar with gradient border */}
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
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

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 truncate">{campaign.title}</h3>
                                <Badge
                                    variant={campaign.status === 'active' ? 'default' : 'secondary'}
                                    className={`capitalize text-xs flex-shrink-0 ${campaign.status === 'active'
                                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                        : ''
                                        }`}
                                >
                                    {campaign.status === 'active' ? 'Activa' : campaign.status === 'completed' ? 'Completada' : 'Archivada'}
                                </Badge>
                            </div>

                            <p className="text-sm text-gray-500 line-clamp-1 mb-3">{campaign.description}</p>

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <DollarSignIcon className="h-3.5 w-3.5" />
                                    <span className="font-medium">${campaign.budget?.toLocaleString() || 0}</span>
                                    <span className="text-gray-400">total</span>
                                </div>
                                {campaign.cost_per_1k_views && campaign.cost_per_1k_views > 0 && (
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <span className="font-medium">${campaign.cost_per_1k_views}</span>
                                        <span className="text-gray-400">/ 1K views</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <span>{timeAgo(campaign.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                                onClick={() => onEdit(campaign)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                                disabled={deletingId === campaign.id}
                                onClick={() => handleDelete(campaign.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function DollarSignIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}
