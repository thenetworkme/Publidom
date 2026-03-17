import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VideoSubmissionModal } from "@/components/ui/VideoSubmissionModal";
import { Loader2, Plus } from "lucide-react";

interface JoinedCampaign {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    budget?: number;
    cost_per_1k_views?: number;
    instructions_url?: string;
    status: string;
    joined_at: string;
}

export function MyCampaigns() {
    const [campaigns, setCampaigns] = useState<JoinedCampaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState<JoinedCampaign | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    useEffect(() => {
        fetchMyCampaigns();
    }, []);

    const fetchMyCampaigns = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/campaigns/my-campaigns`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCampaigns(data);
                setLastUpdated('Ahora');
            }
        } catch (err) {
            console.error('Error fetching campaigns:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmissionSuccess = () => {
        setSelectedCampaign(null);
        // Optionally refresh campaigns
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-bold tracking-tight">Mis campañas</h2>
                </div>
                <Card className="flex min-h-[200px] items-center justify-center border border-gray-100 shadow-none bg-white rounded-[2.5rem]">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </Card>
            </div>
        );
    }

    if (campaigns.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-bold tracking-tight">Mis campañas</h2>
                    <span className="text-xs font-medium text-gray-400">Actualizado {lastUpdated}</span>
                </div>

                <Card className="flex min-h-[300px] items-center justify-center border border-gray-100 shadow-none bg-white rounded-[2.5rem]">
                    <CardContent className="flex flex-col items-center gap-6 text-center p-8">
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg text-gray-500">No hay campañas activas</h3>
                            <p className="text-sm text-gray-400 font-medium max-w-[240px] mx-auto leading-relaxed">
                                Explora listados para crear clips para creadores y marcas.
                            </p>
                        </div>
                        <Button
                            onClick={() => window.location.href = '/'}
                            className="rounded-full bg-black text-white hover:bg-black/90 px-8 font-bold h-11 transition-transform active:scale-95"
                        >
                            Buscar campañas
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-bold tracking-tight">Mis campañas</h2>
                    <span className="text-xs font-medium text-gray-400">Actualizado {lastUpdated}</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {campaigns.map((campaign) => (
                        <Card
                            key={campaign.id}
                            onClick={() => setSelectedCampaign(campaign)}
                            className="cursor-pointer border border-gray-100 shadow-none bg-white rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
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
                                        <h3 className="font-semibold text-gray-900 truncate mb-1">
                                            {campaign.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                                            {campaign.description}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {campaign.cost_per_1k_views && (
                                                <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                                                    ${campaign.cost_per_1k_views}/1K views
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Add Button */}
                                    <button className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Video Submission Modal */}
            {selectedCampaign && (
                <VideoSubmissionModal
                    isOpen={!!selectedCampaign}
                    onClose={() => setSelectedCampaign(null)}
                    campaignId={selectedCampaign.id}
                    campaignTitle={selectedCampaign.title}
                    onSubmitSuccess={handleSubmissionSuccess}
                />
            )}
        </>
    );
}

