import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Campaign } from '@/types/campaign';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Users } from 'lucide-react';

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

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
                <Card key={campaign.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
                    <div className="relative h-48 w-full bg-gray-100">
                        {campaign.image_url ? (
                            <img
                                src={campaign.image_url}
                                alt={campaign.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                Sin imagen
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className="capitalize shadow-sm">
                                {campaign.status}
                            </Badge>
                        </div>
                    </div>

                    <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-1">{campaign.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 pb-2">
                        <p className="line-clamp-2 text-sm text-gray-500 mb-4 h-10">
                            {campaign.description}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                                <DollarSignIcon className="h-4 w-4" />
                                <span className="font-semibold">{campaign.budget || 0}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                                {/* Placeholder for subscriber count */}
                                <Users className="h-4 w-4" />
                                <span>--</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="grid grid-cols-2 gap-2 border-t bg-gray-50/50 p-4">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => onEdit(campaign)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            disabled={deletingId === campaign.id}
                            onClick={() => handleDelete(campaign.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingId === campaign.id ? '...' : 'Eliminar'}
                        </Button>
                    </CardFooter>
                </Card>
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
