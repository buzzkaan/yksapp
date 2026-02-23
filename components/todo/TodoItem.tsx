"use client";
import { useTransition } from "react";
import { konuToggle, konuSil } from "@/server/actions/konular";
import toast from "react-hot-toast";
import type { Konu } from "@/lib/types";
import { ONCELIK } from "./constants";

export function TodoItem({
  konu, dersRenk, onRefresh,
}: { konu: Konu; dersRenk: string; onRefresh: () => void }) {
  const [pending, startT] = useTransition();
  const oncelik = ONCELIK.find(o => o.val === konu.oncelik) ?? ONCELIK[0];

  function toggle() {
    startT(async () => {
      await konuToggle(konu.id, !konu.tamamlandi);
      if (!konu.tamamlandi) toast.success("⭐ Tamamlandı!");
      onRefresh();
    });
  }

  function sil() {
    startT(async () => {
      await konuSil(konu.id);
      toast("🗑️ Silindi", { icon: "⚠️" });
      onRefresh();
    });
  }

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 transition-all ${pending ? "opacity-50 pointer-events-none" : ""}`}
      style={{
        background: konu.tamamlandi ? "#CCF0B8" : "#F8F0DC",
        borderBottom: "3px solid #D0D0E8",
      }}
    >
      <button
        onClick={toggle}
        className="mt-0.5 w-7 h-7 flex-shrink-0 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        style={{
          backgroundColor: konu.tamamlandi ? dersRenk : "#F8F0DC",
          border: "3px solid #101010",
          boxShadow: konu.tamamlandi ? "none" : "2px 2px 0 0 #101010",
        }}
      >
        {konu.tamamlandi && (
          <span className="text-white text-base leading-none font-bold" style={{ textShadow: "1px 1px 0 #101010" }}>✓</span>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className="font-[family-name:var(--font-body)] text-lg leading-snug"
          style={{
            color: konu.tamamlandi ? "#484858" : "#101010",
            textDecoration: konu.tamamlandi ? "line-through" : "none",
          }}
        >
          {konu.baslik}
        </p>
        {konu.aciklama && (
          <p className="font-[family-name:var(--font-body)] text-sm mt-0.5 leading-snug" style={{ color: "#484858" }}>
            {konu.aciklama}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
        <span
          className="font-[family-name:var(--font-body)] text-base leading-none"
          title={oncelik.label}
          style={{ color: oncelik.renk }}
        >
          {oncelik.icon}
        </span>
        <button
          onClick={sil}
          className="w-6 h-6 flex items-center justify-center transition-colors font-[family-name:var(--font-body)] text-lg leading-none cursor-pointer"
          title="Sil"
          style={{ color: "#8890B8" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#E01828")}
          onMouseLeave={e => (e.currentTarget.style.color = "#8890B8")}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
