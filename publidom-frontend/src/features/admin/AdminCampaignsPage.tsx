import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Campaign } from '@/types/campaign';
import { AdminStats } from './components/AdminStats';
import { CampaignList } from './components/CampaignList';
import { CreateCampaignForm } from './components/CreateCampaignForm';
import { EditCampaignDialog } from './components/EditCampaignDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutDashboard } from 'lucide-react';

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [view, setView] = useState<'list' | 'create'>('list');
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

    const fetchCampaigns = async () => {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setCampaigns(data);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    // Derived Stats
    const stats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        totalBudget: campaigns.filter(c => c.status === 'active').reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0)
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto p-6 space-y-8 max-w-7xl">
                {/* Navigation Tabs */}
                <div className="flex gap-2 border-b pb-4">
                    <Button
                        variant={view === 'list' ? 'default' : 'ghost'}
                        onClick={() => setView('list')}
                        className="gap-2"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Vista General
                    </Button>
                    <Button
                        variant={view === 'create' ? 'default' : 'ghost'}
                        onClick={() => setView('create')}
                        className="gap-2"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Nueva Campaña
                    </Button>
                </div>

                {/* Main Content */}
                {view === 'list' ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <AdminStats {...stats} />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">Todas las Campañas</h2>
                                <span className="text-sm text-gray-500">{campaigns.length} resultados</span>
                            </div>
                            <CampaignList
                                campaigns={campaigns}
                                onRefresh={fetchCampaigns}
                                onEdit={(c) => setEditingCampaign(c)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-right duration-300">
                        <div className="mb-6">
                            <Button variant="link" onClick={() => setView('list')} className="px-0 text-gray-500">← Volver al listado</Button>
                        </div>
                        <CreateCampaignForm onSuccess={() => {
                            fetchCampaigns();
                            setView('list');
                        }} />
                    </div>
                )}
            </div>

            {/* Modals */}
            <EditCampaignDialog
                open={!!editingCampaign}
                campaign={editingCampaign}
                onClose={() => setEditingCampaign(null)}
                onSuccess={fetchCampaigns}
            />
        </div>
    );
}
