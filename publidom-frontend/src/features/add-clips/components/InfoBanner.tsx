import { IconBulb } from "@tabler/icons-react";

export function InfoBanner() {
    return (
        <div className="flex items-start gap-4 rounded-3xl bg-white p-6 border border-gray-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-gray-200">
                <IconBulb size={20} className="text-black" stroke={2} />
            </div>
            <div className="pt-1">
                <h3 className="font-bold text-sm text-black">Envía los clips tan pronto como los publiques.</h3>
                <p className="text-sm text-gray-500 font-medium mt-0.5">
                    Las vistas obtenidas antes del envío no cuentan para los pagos.
                </p>
            </div>
        </div>
    );
}
