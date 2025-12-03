import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const loginTimestamp = localStorage.getItem('loginTimestamp');

    // 48 hours in milliseconds
    const SESSION_DURATION = 48 * 60 * 60 * 1000;

    const isValidSession = () => {
        if (!token || !loginTimestamp) return false;

        const now = new Date().getTime();
        const loginTime = parseInt(loginTimestamp, 10);

        if (now - loginTime > SESSION_DURATION) {
            // Session expired
            localStorage.removeItem('token');
            localStorage.removeItem('loginTimestamp');
            return false;
        }

        return true;
    };

    if (!isValidSession()) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
