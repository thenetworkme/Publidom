import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';

export const AdminGuard = () => {
    const { profile, loading, isAdmin } = useProfile();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!profile || !isAdmin) {
        // Redirect to dashboard if logged in but not admin, or login if not logged in
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
