import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/features/dashboard/DashboardPage";
import AddClipsPage from "@/features/add-clips/AddClipsPage";
import { EarningsPage } from "@/features/earnings/EarningsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import Login from "@/features/auth/Login";
import Signup from "@/features/auth/Signup";
import App from "@/App"; // Assuming App is the main layout component
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminGuard } from "@/features/auth/components/AdminGuard";
import AdminCampaignsPage from "@/features/admin/AdminCampaignsPage";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                element: <App />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                    {
                        path: "add-clips",
                        element: <AddClipsPage />,
                    },
                    {
                        path: "earnings",
                        element: <EarningsPage />,
                    },
                    {
                        path: "settings",
                        element: <SettingsPage />,
                    },
                    {
                        path: "admin",
                        element: <AdminGuard />,
                        children: [
                            {
                                path: "campaigns",
                                element: <AdminCampaignsPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
