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
        background: konu.tamamlandi ? "#006800" : "#A8A8A8",
        borderBottom: "3px solid #000000",
      }}
    >
      <button
        onClick={toggle}
        className="mt-0.5 w-7 h-7 flex-shrink-0 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        style={{
          backgroundColor: konu.tamamlandi ? dersRenk : "#A8A8A8",
          border: "3px solid #000000",
          boxShadow: konu.tamamlandi ? "none" : "2px 2px 0 0 #000000",
        }}
      >
        {konu.tamamlandi && (
          <span className="text-white text-base leading-none font-bold" style={{ textShadow: "1px 1px 0 #000000" }}>✓</span>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-body text-lg leading-snug ${konu.tamamlandi ? "line-through text-mario-stone-dark" : "text-black"}`}>
          {konu.baslik}
        </p>
        {konu.aciklama && (
          <p className="font-body text-sm mt-0.5 leading-snug text-mario-stone-dark">
            {konu.aciklama}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
        <span
          className="font-body text-base leading-none"
          title={oncelik.label}
          style={{ color: oncelik.renk }}
        >
          {oncelik.icon}
        </span>
        <button
          onClick={sil}
          className="w-6 h-6 flex items-center justify-center font-body text-lg leading-none cursor-pointer text-mario-light hover:text-mario-red transition-colors"
          title="Sil"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
