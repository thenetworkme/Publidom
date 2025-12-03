import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export function StatsSection() {
    const [stats, setStats] = useState({
        total_profiles: 0,
        total_posts: 0,
        total_followers: 0,
        total_views: 0,
        average_views: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('http://localhost:3000/api/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setStats(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statsDisplay = [
        {
            label: "Perfiles",
            value: stats.total_profiles.toString(),
        },
        {
            label: "Posts",
            value: stats.total_posts.toString(),
        },
        {
            label: "Seguidores",
            value: stats.total_followers.toString(),
        },
        {
            label: "Vistas",
            value: stats.total_views.toString(),
        },
        {
            label: "Vistas Prom.",
            value: Math.round(stats.average_views).toString(),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-black">Mis estadísticas</h2>
                    <p className="text-xs text-gray-400 font-medium mt-1">
                        Publica clips y mira cómo crecen tus estadísticas
                    </p>
                </div>
                <button className="text-xs font-bold border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors">
                    Conectar cuentas
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
