import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IconPlayerPlayFilled, IconPlus } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export function TopClips() {
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClips = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:3000/api/clips?limit=10&sortBy=views_count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setClips(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClips();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Mejores clips</h2>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Tus clips de Vyro más vistos
        </p>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex w-max space-x-5">
          {loading ? (
            <div className="text-sm text-gray-400">Cargando clips...</div>
          ) : clips.length === 0 ? (
            <div className="text-sm text-gray-400">No tienes clips todavía</div>
          ) : (
            clips.map((clip) => (
              <div
                key={clip.id}
                className="relative aspect-[9/16] w-[140px] overflow-hidden rounded-3xl bg-gray-100 shrink-0 group cursor-pointer hover:-translate-y-1 transition-transform duration-300"
              >
                <img
                  src={clip.thumbnail_url || `https://picsum.photos/seed/${clip.id}/200/300`}
                  alt={clip.title || 'Clip'}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-bold shadow-sm flex items-center gap-1.5">
                  <IconPlayerPlayFilled size={10} /> {clip.views_count}
                </div>
              </div>
            ))
          )}

          <div className="flex aspect-[9/16] w-[140px] shrink-0 flex-col items-center justify-center gap-3 rounded-3xl bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all duration-300 group hover:-translate-y-1">
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
