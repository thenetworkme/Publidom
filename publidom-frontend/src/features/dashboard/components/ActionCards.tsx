import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { IconBrandDiscord, IconPlus, IconWallet } from "@tabler/icons-react";

const actions = [
    {
        title: "Unirse a Discord",
        description: "Obtén ayuda o sé el primero en enterarte de nuevas campañas.",
        icon: IconBrandDiscord,
        href: "https://discord.com",
    },
    {
        title: "Enviar clips",
        description: "Añade clips a las campañas a las que te has unido.",
        icon: IconPlus,
        href: "/add-clips",
    },
    {
        title: "Gestionar ganancias",
        description: "Configura tu billetera y retira tus ganancias.",
        icon: IconWallet,
        href: "/earnings",
    },
];

export function ActionCards() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {actions.map((action) => (
                <Link key={action.title} to={action.href}>
                    <Card className="group border-none bg-gray-100/80 hover:bg-gray-200/80 shadow-none transition-all duration-300 rounded-[2rem] overflow-hidden cursor-pointer h-full">
                        <CardContent className="flex flex-col gap-3 p-8">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-transparent flex items-center justify-center">
                                    <action.icon size={24} className="text-black" stroke={1.5} />
                                </div>
                                <span className="font-bold text-base tracking-tight text-black">{action.title}</span>
                            </div>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed pl-11">
                                {action.description}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
