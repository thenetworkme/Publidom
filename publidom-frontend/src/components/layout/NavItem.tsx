import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
    icon: any;
    label: string;
    href: string;
    active?: boolean;
}

export function NavItem({ icon: Icon, label, href, active }: NavItemProps) {
    return (
        <Link to={href} className="group flex flex-col items-center gap-1 cursor-pointer">
            <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                active ? "bg-black text-white" : "text-black group-hover:bg-gray-100"
            )}>
                <Icon size={22} stroke={2} className={cn(active ? "fill-white" : "")} />
            </div>
            <span className={cn(
                "text-[11px] font-semibold tracking-tight transition-colors",
                active ? "text-black" : "text-gray-500 group-hover:text-black"
            )}>{label}</span>
        </Link>
    );
}
