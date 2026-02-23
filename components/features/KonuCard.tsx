"use client";
import { PixelBadge } from "@/components/pixel/PixelBadge";
import { konuTamamla, konuSil } from "@/server/actions/konular";
import toast from "react-hot-toast";

interface KonuCardProps {
  id: string;
  baslik: string;
  aciklama?: string | null;
  tamamlandi: boolean;
  oncelik: number;
  dersRenk: string;
  onRefresh?: () => void;
}

const oncelikMap = {
  1: { label: "Düşük", variant: "green" as const },
  2: { label: "Orta",  variant: "gold"  as const },
  3: { label: "Yüksek", variant: "red"  as const },
};

export function KonuCard({ id, baslik, aciklama, tamamlandi, oncelik, dersRenk, onRefresh }: KonuCardProps) {
  const p = oncelikMap[oncelik as 1 | 2 | 3] ?? oncelikMap[1];

  async function handleToggle() {
    if (tamamlandi) return;
    await konuTamamla(id);
    toast.success("✅ Konu hasat edildi!");
    onRefresh?.();
  }

  async function handleSil() {
    await konuSil(id);
    toast("🗑️ Konu silindi", { icon: "⚠️" });
    onRefresh?.();
  }

  return (
    <div
      className={`flex items-start gap-3 border-4 border-[#101010] p-3 transition-all ${
        tamamlandi ? "opacity-60 bg-[#E0F0E0]" : "bg-[#FFFFFF]"
      }`}
      style={{ borderLeftColor: dersRenk, borderLeftWidth: "8px" }}
    >
      <button
        onClick={handleToggle}
        className="mt-0.5 w-6 h-6 border-4 border-[#101010] flex-shrink-0 flex items-center justify-center bg-white hover:bg-[#18C018] transition-colors"
        title={tamamlandi ? "Tamamlandı" : "Tamamla"}
      >
        {tamamlandi && <span className="text-xs leading-none text-white">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`font-[family-name:var(--font-body)] text-lg leading-tight ${
            tamamlandi ? "line-through text-[#505068]" : "text-[#101010]"
          }`}
        >
          {baslik}
        </p>
        {aciklama && (
          <p className="font-[family-name:var(--font-body)] text-sm text-[#505068] mt-0.5">
            {aciklama}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <PixelBadge variant={p.variant}>{p.label}</PixelBadge>
        <button
          onClick={handleSil}
          className="text-[#D81818] hover:text-[#E81818] font-[family-name:var(--font-body)] text-lg"
          title="Sil"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
