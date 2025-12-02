import { Button } from "@/components/ui/button";
import { IconBrandDiscord, IconBrandTiktok, IconTrash, IconPlus } from "@tabler/icons-react";

export function ConnectedAccounts() {
    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">Cuentas conectadas</h2>
                    <span className="text-2xl font-bold text-gray-400">(2)</span>
                </div>
                <p className="text-gray-500 max-w-lg">
                    Vincula las cuentas de redes sociales donde publicas contenido. Debes conectar una cuenta para enviar clips.
                </p>
            </div>

            <div className="space-y-4">
                {/* Discord */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                            <IconBrandDiscord className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">krazesnips</h3>
                            <p className="text-xs text-gray-400">agregado 20/10/25</p>
                        </div>
                    </div>
                    <button className="text-gray-300 hover:text-red-500 transition-colors">
                        <IconTrash className="w-5 h-5" />
                    </button>
                </div>

                {/* TikTok */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                            <IconBrandTiktok className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">krazesnips</h3>
                            <p className="text-xs text-gray-400">agregado 20/10/25</p>
                        </div>
                    </div>
                    <button className="text-gray-300 hover:text-red-500 transition-colors">
                        <IconTrash className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <Button variant="outline" className="gap-2 rounded-xl bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600 font-medium h-12 w-full justify-start px-4">
                <IconPlus className="w-5 h-5" />
                Conectar una cuenta
            </Button>
        </div>
    );
}
