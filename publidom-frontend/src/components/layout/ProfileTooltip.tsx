import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBrandDiscord, IconArrowUpRight } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface ProfileTooltipProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    user: any;
}

export function ProfileTooltip({ isOpen, onClose, onLogout, user }: ProfileTooltipProps) {
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !user) return null;

    return (
        <div
            ref={tooltipRef}
            className="absolute top-full right-0 mt-3 w-[260px] rounded-2xl bg-white/95 backdrop-blur-sm p-4 shadow-lg border border-gray-100/50 z-50 animate-in fade-in slide-in-from-top-2 duration-300 ease-out"
        >
            {/* Header Section */}
            <div className="flex flex-col items-start gap-0.5 mb-3">
                <Badge variant="secondary" className="bg-blue-50/80 text-blue-600 hover:bg-blue-100/80 font-semibold text-[9px] tracking-wider px-1.5 py-0 h-4 mb-1 border-0">
                    CLIPPER
                </Badge>
                <h3 className="text-base font-bold text-gray-900 leading-tight tracking-tight">
                    {user.first_name} {user.last_name}
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                    {user.email}
                </p>
            </div>

            {/* Settings Button */}
            <Link to="/settings" className="w-full block mb-3" onClick={onClose}>
                <Button
                    variant="ghost"
                    className="w-full justify-center bg-gray-50/80 hover:bg-gray-100 text-gray-700 font-medium rounded-xl h-8 text-xs transition-all duration-200"
                >
                    Configuración
                </Button>
            </Link>

            {/* Links Section */}
            <div className="space-y-0.5 mb-3">
                <a href="#" className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group">
                    <div className="flex items-center gap-2.5">
                        <IconBrandDiscord className="w-4 h-4 text-gray-600 group-hover:text-black transition-colors" />
                        <span className="text-xs font-medium text-gray-600 group-hover:text-black transition-colors">Discord</span>
                    </div>
                    <IconArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </a>
                <a href="#" className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group">
                    <div className="flex items-center gap-2.5">
                        <span className="text-xs font-medium text-gray-600 group-hover:text-black transition-colors">Dar feedback</span>
                    </div>
                    <IconArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </a>
                <a href="#" className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group">
                    <div className="flex items-center gap-2.5">
                        <span className="text-xs font-medium text-gray-600 group-hover:text-black transition-colors">Soporte</span>
                    </div>
                    <IconArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </a>
            </div>

            {/* Logout */}
            <div className="mb-3 px-2">
                <button
                    onClick={onLogout}
                    className="text-xs font-medium text-gray-600 hover:text-red-500 transition-colors"
                >
                    Cerrar sesión
                </button>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2.5 text-[10px] text-gray-300 font-medium px-2 pt-3 border-t border-gray-50">
                <a href="#" className="hover:text-gray-500 transition-colors">Privacidad</a>
                <a href="#" className="hover:text-gray-500 transition-colors">Términos</a>
                <a href="#" className="hover:text-gray-500 transition-colors">Términos Clipper</a>
            </div>
        </div>
    );
}
