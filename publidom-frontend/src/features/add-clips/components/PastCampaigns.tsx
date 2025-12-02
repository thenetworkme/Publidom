import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconCheck } from "@tabler/icons-react";

export function PastCampaigns() {
    return (
        <div className="space-y-8">
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100"></span>
                </div>
                <span className="relative bg-[#FAFAFA] px-4 text-sm font-medium text-gray-400">
                    Campañas pasadas
                </span>
            </div>

            <div className="rounded-[2.5rem] bg-white p-4 border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-12 w-12 rounded-xl">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>DM</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-sm">Dhar Mann Studios</span>
                                <Badge variant="secondary" className="h-4 w-4 rounded-full p-0 flex items-center justify-center bg-black text-white">
                                    <IconCheck size={10} stroke={4} />
                                </Badge>
                            </div>
                            <Badge variant="secondary" className="w-fit bg-black text-[10px] font-bold text-white hover:bg-black px-2 py-0.5 rounded-full">
                                COMPLETADO
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 text-right">
                        <div className="flex flex-col items-end gap-0.5">
                            <span className="font-bold text-sm">0</span>
                            <span className="text-[10px] font-medium text-gray-400">Publicaciones</span>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                            <span className="font-bold text-sm">0</span>
                            <span className="text-[10px] font-medium text-gray-400">Vistas</span>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                            <span className="font-bold text-sm">$0.00</span>
                            <span className="text-[10px] font-medium text-gray-400">Ganado</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

