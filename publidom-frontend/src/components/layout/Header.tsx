import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconHome, IconCards, IconBusinessplan } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { NavItem } from "./NavItem";
import { ProfileTooltip } from "./ProfileTooltip";
import { useState, useEffect } from "react";

export function Header() {
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Fetch user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('http://localhost:3000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loginTimestamp');
        window.location.href = '/login';
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto flex h-20 items-center justify-between px-6">
                {/* Logo Section */}
                <div className="flex items-center gap-1">
                    <span className="text-2xl font-black tracking-tighter text-black">VYRO</span>
                    <Badge variant="secondary" className="bg-black text-white text-[10px] h-5 px-1.5 rounded-md font-bold hover:bg-black">BETA</Badge>
                </div>

                {/* Navigation Section */}
                <nav className="flex items-center gap-8">
                    <NavItem
                        icon={IconHome}
                        label="Inicio"
                        href="/"
                        active={location.pathname === "/"}
                    />
                    <NavItem
                        icon={IconCards}
                        label="Agregar Clips"
                        href="/add-clips"
                        active={location.pathname === "/add-clips"}
                    />
                    <NavItem
                        icon={IconBusinessplan}
                        label="Ganancias"
                        href="/earnings"
                        active={location.pathname === "/earnings"}
                    />
                </nav>

                {/* User Section */}
                <div className="flex items-center gap-4 relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="focus:outline-none"
                    >
                        <Avatar className="h-9 w-9 bg-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarFallback className="bg-gray-200 text-gray-600 font-medium">
                                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </button>

                    <ProfileTooltip
                        isOpen={isProfileOpen}
                        onClose={() => setIsProfileOpen(false)}
                        onLogout={handleLogout}
                        user={user}
                    />
                </div>
            </div>
        </header>
    );
}
