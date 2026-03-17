import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IconPlayerPlayFilled, IconPlus, IconBrandTiktok, IconBrandInstagram, IconBrandYoutube } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface VideoSubmission {
  id: string;
  video_url: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  platform_video_id: string;
  views_count: number;
  likes_count: number;
  created_at: string;
  campaigns?: {
    title: string;
    image_url?: string;
  };
}

// Generate thumbnail URL based on platform
const getThumbnailUrl = (submission: VideoSubmission): string => {
  const { platform, platform_video_id } = submission;

  switch (platform) {
    case 'youtube':
      // YouTube provides direct thumbnail access
      return `https://img.youtube.com/vi/${platform_video_id}/maxresdefault.jpg`;
    case 'tiktok':
    case 'instagram':
      // For TikTok and Instagram, use campaign image or gradient placeholder
      return submission.campaigns?.image_url || '';
    default:
      return '';
  }
};

// Get platform icon
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'youtube':
      return <IconBrandYoutube size={14} className="text-red-500" />;
    case 'tiktok':
      return <IconBrandTiktok size={14} />;
    case 'instagram':
      return <IconBrandInstagram size={14} className="text-pink-500" />;
    default:
      return null;
  }
};

export function TopClips() {
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Sort by views_count descending
          const sorted = data.sort((a: VideoSubmission, b: VideoSubmission) =>
            (b.views_count || 0) - (a.views_count || 0)
          );
          setSubmissions(sorted.slice(0, 10)); // Top 10
        }
      } catch (err) {
        console.error('Fetch submissions error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleOpenVideo = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Mejores clips</h2>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Tus videos más vistos en campañas
        </p>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex w-max space-x-5">
          {loading ? (
            <div className="text-sm text-gray-400">Cargando clips...</div>
          ) : submissions.length === 0 ? (
            <div className="text-sm text-gray-400">No tienes videos todavía. ¡Únete a una campaña!</div>
          ) : (
            submissions.map((submission) => {
              const thumbnailUrl = getThumbnailUrl(submission);

              return (
                <div
                  key={submission.id}
                  onClick={() => handleOpenVideo(submission.video_url)}
                  className="relative aspect-[9/16] w-[140px] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shrink-0 group cursor-pointer hover:-translate-y-1 transition-transform duration-300"
                >
                  {/* Thumbnail or Gradient */}
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt="Video thumbnail"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback if thumbnail fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                      <PlatformIcon platform={submission.platform} />
                    </div>
                  )}

                  {/* Platform Badge */}
                  <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm p-1.5 shadow-sm">
                    <PlatformIcon platform={submission.platform} />
                  </div>

                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <IconPlayerPlayFilled size={24} className="text-black ml-1" />
                    </div>
                  </div>

                  {/* Views badge */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-bold shadow-sm flex items-center gap-1.5">
                    <IconPlayerPlayFilled size={10} /> {(submission.views_count || 0).toLocaleString()}
                  </div>
                </div>
              );
            })
          )}

          {/* Add button */}
          <div
            onClick={() => navigate('/add-clips')}
            className="flex aspect-[9/16] w-[140px] shrink-0 flex-col items-center justify-center gap-3 rounded-3xl bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black group-hover:scale-110 transition-transform">
              <IconPlus size={20} stroke={3} />
            </div>
            <span className="font-bold text-sm">Agregar</span>
          </div>
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}

