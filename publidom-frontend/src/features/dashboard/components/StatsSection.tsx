import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface SubmissionStats {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalEarnings: number;
    totalSubmissions: number;
}

export function StatsSection() {
    const [oldStats, setOldStats] = useState({
        total_profiles: 0,
        total_posts: 0,
        total_followers: 0,
        total_views: 0,
        average_views: 0
    });
    const [submissionStats, setSubmissionStats] = useState<SubmissionStats>({
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalEarnings: 0,
        totalSubmissions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Fetch original stats
                const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setOldStats(statsData);
                }

                // Fetch submission stats
                const subRes = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (subRes.ok) {
                    const subData = await subRes.json();
                    setSubmissionStats(subData);
                }
            } catch (err) {
                console.error('Stats fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllStats();
    }, []);

    // Combine stats - prioritize submission stats for views if available
    const combinedViews = submissionStats.totalViews > 0
        ? submissionStats.totalViews
        : oldStats.total_views;

    const statsDisplay = [
        {
            label: "Videos",
            value: submissionStats.totalSubmissions.toString(),
        },
        {
            label: "Vistas",
            value: combinedViews.toLocaleString(),
        },
        {
            label: "Likes",
            value: submissionStats.totalLikes.toLocaleString(),
        },
        {
            label: "Comentarios",
            value: submissionStats.totalComments.toLocaleString(),
        },
        {
            label: "Ganancias",
            value: `$${submissionStats.totalEarnings.toFixed(2)}`,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-black">Mis estadísticas</h2>
                    <p className="text-xs text-gray-400 font-medium mt-1">
                        Estadísticas de tus videos en campañas
                    </p>
                </div>
                <button className="text-xs font-bold border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors">
                    Actualizar
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statsDisplay.map((stat) => (
                    <Card key={stat.label} className="border border-gray-100 bg-white shadow-none rounded-[2rem]">
                        <CardContent className="p-6 flex flex-col justify-between h-32">
                            <span className="text-xs font-bold text-gray-500">{stat.label}</span>
                            <span className="text-3xl font-bold tracking-tighter text-black self-end">
                                {loading ? "..." : stat.value}
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

