import { InfoBanner } from "./components/InfoBanner";
import { MyCampaigns } from "./components/MyCampaigns";
import { PastCampaigns } from "./components/PastCampaigns";

export default function AddClipsPage() {
    return (
        <div className="min-h-screen bg-white font-poppins selection:bg-black/10">
            <main className="container mx-auto max-w-5xl px-6 py-10 space-y-10">
                <InfoBanner />
                <MyCampaigns />
                <PastCampaigns />
            </main>
        </div>
    );
}
