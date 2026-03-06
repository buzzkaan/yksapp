"use client";
import { cn } from "@/lib/utils";
import { PixelBadge } from "@/components/pixel/PixelBadge";
import { konuToggle, konuSil } from "@/server/actions/konular";
import toast from "react-hot-toast";

const ONCELIK_BADGE: Record<number, { label: string; variant: "green" | "gold" | "red" }> = {
  1: { label: "Normal", variant: "green" },
  2: { label: "Orta",   variant: "gold"  },
  3: { label: "Acil",   variant: "red"   },
};

export function KonuCard({
  id,
  baslik,
  aciklama,
  tamamlandi,
  oncelik,
  dersRenk,
  onRefresh,
}: {
  id: string;
  baslik: string;
  aciklama?: string | null;
  tamamlandi: boolean;
  oncelik: number;
  dersRenk: string;
  onRefresh?: () => void;
}) {
  const p = ONCELIK_BADGE[oncelik] ?? ONCELIK_BADGE[1];

  async function handleToggle() {
    if (tamamlandi) return;
    await konuToggle(id, true);
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
      className={cn(
        "flex items-start gap-3 border-4 border-black p-3 border-l-[8px] transition-all",
        tamamlandi ? "opacity-60 bg-mario-green-dark" : "bg-mario-navy"
      )}
      style={{ borderLeftColor: dersRenk }}
    >
      <button
        onClick={handleToggle}
        className="mt-0.5 w-6 h-6 border-4 border-black shrink-0 flex items-center justify-center bg-white hover:bg-mario-green transition-colors"
        title={tamamlandi ? "Tamamlandı" : "Tamamla"}
      >
        {tamamlandi && <span className="text-xs leading-none text-white">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-body text-lg leading-tight text-mario-light",
          tamamlandi && "line-through"
        )}>
          {baslik}
        </p>
        {aciklama && (
          <p className="font-body text-sm text-mario-light mt-0.5">{aciklama}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <PixelBadge variant={p.variant}>{p.label}</PixelBadge>
        <button
          onClick={handleSil}
          className="font-body text-lg text-mario-red hover:text-mario-red-dark transition-colors"
          title="Sil"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
