import { Switch } from "@/components/ui/switch";

export function Notifications() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Notificaciones</h2>
            </div>

            <div className="space-y-6">
                <h3 className="font-bold text-gray-900">Correo electrónico</h3>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="space-y-1">
                        <p className="font-medium text-gray-900">Nuevas campañas</p>
                        <p className="text-sm text-gray-500">Notificarme cuando se lancen nuevas campañas de clips</p>
                    </div>
                    <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="space-y-1">
                        <p className="font-medium text-gray-900">Actualizaciones de campañas</p>
                        <p className="text-sm text-gray-500">Enviarme actualizaciones de estado de las campañas a las que me he unido</p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </div>
        </div>
    );
}
