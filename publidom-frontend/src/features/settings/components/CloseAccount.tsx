import { Button } from "@/components/ui/button";
import { IconAlertTriangle } from "@tabler/icons-react";

export function CloseAccount() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Cerrar cuenta</h2>
            </div>

            <div className="border border-red-100 rounded-2xl p-6 bg-red-50/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                        <IconAlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-500">Eliminar cuenta</h3>
                        <p className="text-sm text-gray-500">Eliminar permanentemente tu cuenta de Vyro.</p>
                    </div>
                </div>
                <Button variant="ghost" className="bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl h-10 px-6">
                    Eliminar
                </Button>
            </div>
        </div>
    );
}
