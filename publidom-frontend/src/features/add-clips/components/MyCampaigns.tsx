import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function MyCampaigns() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold tracking-tight">Mis campañas</h2>
                <span className="text-xs font-medium text-gray-400">Actualizado hace 52m</span>
            </div>

            <Card className="flex min-h-[300px] items-center justify-center border border-gray-100 shadow-none bg-white rounded-[2.5rem]">
                <CardContent className="flex flex-col items-center gap-6 text-center p-8">
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg text-gray-500">No hay campañas activas</h3>
                        <p className="text-sm text-gray-400 font-medium max-w-[240px] mx-auto leading-relaxed">
                            Explora listados para crear clips para creadores y marcas.
                        </p>
                    </div>
                    <Button className="rounded-full bg-black text-white hover:bg-black/90 px-8 font-bold h-11 transition-transform active:scale-95">
                        Buscar campañas
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
