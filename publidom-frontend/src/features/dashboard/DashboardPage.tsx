import { ActionCards } from "./components/ActionCards";
import { ActiveCampaigns } from "./components/ActiveCampaigns";
import { StatsSection } from "./components/StatsSection";
import { TopClips } from "./components/TopClips";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <main className="container mx-auto max-w-5xl px-4 py-8 space-y-12">
                <ActionCards />
                <ActiveCampaigns />
                <StatsSection />
                <TopClips />
            </main>
        </div>
    );
}
