import { Card, CardContent } from "@/components/ui/card";

const stats = [
    {
        label: "Perfiles",
        value: "2",
    },
    {
        label: "Posts",
        value: "16",
    },
    {
        label: "Seguidores",
        value: "8",
    },
    {
        label: "Vistas",
        value: "18",
    },
    {
        label: "Vistas Prom.",
        value: "1",
    },
];

export function StatsSection() {
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
                {stats.map((stat) => (
                    <Card key={stat.label} className="border border-gray-100 bg-white shadow-none rounded-[2rem]">
                        <CardContent className="p-6 flex flex-col justify-between h-32">
                            <span className="text-xs font-bold text-gray-500">{stat.label}</span>
                            <span className="text-3xl font-bold tracking-tighter text-black self-end">{stat.value}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
