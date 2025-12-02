import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export function PayoutMethods() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Métodos de pago</h2>
                <p className="text-gray-500 max-w-lg mb-4">
                    Vincula una cuenta para retirar fondos. Dependiendo de tu ubicación, puedes conectar una cuenta de <span className="font-bold text-gray-700">Stripe</span> o <span className="font-bold text-gray-700">PayPal</span>.
                </p>
                <p className="text-gray-500">
                    Puedes elegir un método preferido cuando retires dinero.
                </p>
            </div>

            <Button variant="outline" className="gap-2 rounded-xl bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600 font-medium h-12 w-full justify-start px-4">
                <IconPlus className="w-5 h-5" />
                Conectar una cuenta
            </Button>
        </div>
    );
}
