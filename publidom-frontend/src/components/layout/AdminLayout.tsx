import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ProfileTooltip } from "./ProfileTooltip";
import { IconShieldCheck } from "@tabler/icons-react";

/**
 * AdminLayout - Layout component for admin pages without the main header
 * Provides a clean, minimal layout with only profile access for logout
 */
export function AdminLayout() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();
                setUser(profile || { email: authUser.email });
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const getInitials = () => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return user?.email?.[0]?.toUpperCase() || 'A';
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            {/* Minimal Admin Top Bar */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 py-3 max-w-7xl">
                    <div className="flex items-center justify-between">
                        {/* Admin Badge */}
                        <div className="flex items-center gap-2">
                            <IconShieldCheck className="w-5 h-5 text-purple-600" />
                            <span className="font-semibold text-gray-800">Admin Panel</span>
                        </div>

                        {/* Profile Avatar */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity ring-2 ring-white shadow-sm"
                            >
                                {getInitials()}
                            </button>
                            <ProfileTooltip
                                isOpen={isProfileOpen}
                                onClose={() => setIsProfileOpen(false)}
                                onLogout={handleLogout}
                                user={user}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

