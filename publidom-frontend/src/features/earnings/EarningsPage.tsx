import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function EarningsPage() {
    const [activeTab, setActiveTab] = useState<"available" | "pending" | "paid">("available");

    return (
        <div className="min-h-screen bg-white font-sans antialiased">
            <main className="container mx-auto px-6 py-8 space-y-8">
                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <StatsCard
                        title="Saldo disponible"
                        value="0.00"
                        action={
                            <Button className="bg-black text-white hover:bg-gray-800 rounded-full h-9 text-xs font-bold px-6 transition-transform active:scale-95">
                                Agregar cuenta
                            </Button>
                        }
                    />
                    <StatsCard title="Saldo pendiente" value="0.00" />
                    <StatsCard title="Ganancias totales" value="0.00" />
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1">
                    <TabButton
                        label="Disponible"
                        active={activeTab === "available"}
                        onClick={() => setActiveTab("available")}
                    />
                    <TabButton
                        label="Pendiente"
                        active={activeTab === "pending"}
                        onClick={() => setActiveTab("pending")}
                    />
                    <TabButton
                        label="Pagado"
                        active={activeTab === "paid"}
                        onClick={() => setActiveTab("paid")}
                    />
                </div>

                {/* Table Area */}
                <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-4 border-b border-gray-100 bg-gray-50/30 px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        <div>Fecha</div>
                        <div>Clip</div>
                        <div>Campaña/Descripción</div>
                        <div className="text-right">Monto</div>
                    </div>

                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center py-40 px-4 text-center">
                        <h3 className="text-lg font-bold text-black mb-2">No hay ganancias disponibles</h3>
                        <p className="text-sm text-gray-400 font-medium">
                            ¡Envía clips a campañas y comienza a ganar!
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatsCard({ title, value, action }: { title: string; value: string; action?: React.ReactNode }) {
    return (
        <Card className="rounded-[2.5rem] border border-gray-100 shadow-none bg-white p-8 hover:border-gray-200 transition-colors duration-300">
            <CardContent className="p-0 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[15px] text-black tracking-tight">{title}</span>
                        <IconInfoCircle size={18} className="text-gray-300" stroke={1.5} />
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <span className="text-[2.75rem] font-medium tracking-tighter leading-none">{value}</span>
                    {action}
                </div>
            </CardContent>
        </Card>
    );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200",
                active
                    ? "bg-gray-100 text-black"
                    : "text-gray-400 hover:text-black hover:bg-gray-50"
            )}
        >
            {label}
        </button>
    );
}
