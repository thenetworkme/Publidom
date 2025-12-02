import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/features/dashboard/DashboardPage";
import AddClipsPage from "@/features/add-clips/AddClipsPage";
import { EarningsPage } from "@/features/earnings/EarningsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import Login from "@/features/auth/Login";
import App from "@/App"; // Assuming App is the main layout component

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
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
        ],
    },
]);
