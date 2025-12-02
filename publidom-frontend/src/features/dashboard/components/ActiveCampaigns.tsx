import { Card, CardContent } from "@/components/ui/card";

export function ActiveCampaigns() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold tracking-tight">Campañas activas</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    Selecciona una campaña para ver detalles y comenzar a recortar
                </p>
            </div>

            <Card className="flex min-h-[280px] items-center justify-center border border-gray-100 shadow-none bg-white rounded-[2.5rem]">
                <CardContent className="flex flex-col items-center gap-4 text-center p-8">
                    <h3 className="font-bold text-lg text-black">No hay campañas activas</h3>
                    <p className="text-sm text-gray-400 font-medium max-w-[200px] leading-relaxed">
                        Vuelve pronto para ver campañas a las que unirte.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
