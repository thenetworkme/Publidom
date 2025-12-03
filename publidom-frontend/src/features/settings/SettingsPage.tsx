import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PersonalInfo } from "./components/PersonalInfo";
import { ConnectedAccounts } from "./components/ConnectedAccounts";
import { PayoutMethods } from "./components/PayoutMethods";
import { Notifications } from "./components/Notifications";
import { CloseAccount } from "./components/CloseAccount";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SECTIONS = [
    { id: "personal-info", label: "Información personal", component: PersonalInfo },
    { id: "connected-accounts", label: "Cuentas conectadas", component: ConnectedAccounts },
    { id: "payout-methods", label: "Métodos de pago", component: PayoutMethods },
    { id: "notifications", label: "Notificaciones", component: Notifications },
    { id: "close-account", label: "Cerrar cuenta", component: CloseAccount },
];

export function SettingsPage() {
    const [activeSection, setActiveSection] = useState("personal-info");
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Header height + padding
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveSection(id);
        }
    };

    // Update active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;

            for (const section of SECTIONS) {
                const element = document.getElementById(section.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) return <div className="p-10 text-center">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center gap-5 mb-16">
                    <Avatar className="h-16 w-16 bg-gray-50 border border-gray-100">
                        <AvatarFallback className="bg-gray-50 text-gray-900 font-bold text-2xl">
                            {user?.first_name?.[0]}{user?.last_name?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {user?.first_name} {user?.last_name}
                        </h1>
                        <p className="text-gray-400 font-medium">@{user?.username}</p>
                    </div>
                </div>

                <div className="flex gap-16 items-start">
                    {/* Sidebar */}
                    <nav className="w-64 shrink-0 space-y-1 sticky top-32">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={cn(
                                    "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    activeSection === section.id
                                        ? "bg-black text-white shadow-lg shadow-black/10"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                {section.label}
                            </button>
                        ))}
                    </nav>

                    {/* Content Area */}
                    <div className="flex-1 space-y-24 pb-32">
                        {SECTIONS.map((section) => {
                            const Component = section.component;
                            return (
                                <motion.div
                                    key={section.id}
                                    id={section.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="scroll-mt-32"
                                >
                                    <Component user={user} />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
