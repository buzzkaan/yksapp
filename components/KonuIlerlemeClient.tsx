"use client";
import { useState, useEffect } from "react";
import { DERSLER, KATEGORILER } from "@/lib/yks-categories";
import { DGS_BOLUMLER, KPSS_BOLUMLER } from "@/lib/sinav-data";
import { getSinavTipi } from "@/lib/utils/sinav";

const LS_KONU_KEY = "yks_farm_konu_v1";

function getToplam(sinavTipi: string): number {
  if (sinavTipi === "YKS") {
    const tyt = Object.values(DERSLER).reduce((s, d) => s + d.tytKonular.length, 0);
    const aytKeys = [...new Set(Object.values(KATEGORILER).flatMap((k) => k.ayt))];
    const ayt = aytKeys.reduce((s, k) => s + (DERSLER[k]?.aytKonular.length ?? 0), 0);
    return tyt + ayt;
  }
  if (sinavTipi === "DGS")
    return DGS_BOLUMLER.flatMap((b) => b.dersler).reduce((s, d) => s + d.konular.length, 0);
  return KPSS_BOLUMLER.flatMap((b) => b.dersler).reduce((s, d) => s + d.konular.length, 0);
}

export function KonuIlerlemeClient() {
  const [tamamlanan, setTamamlanan] = useState(0);
  const [toplam, setToplam] = useState(0);

  useEffect(() => {
    const tip = getSinavTipi();
    const top = getToplam(tip);
    try {
      const data: Record<string, boolean> = JSON.parse(
        localStorage.getItem(LS_KONU_KEY) ?? "{}"
      );
      setTamamlanan(Object.values(data).filter(Boolean).length);
    } catch {
      setTamamlanan(0);
    }
    setToplam(top);
  }, []);

  const pct = toplam > 0 ? Math.round((tamamlanan / toplam) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="font-[family-name:var(--font-body)] text-lg text-[#101010]">
          Tamamlanan Konular
        </span>
        <span
          className="font-[family-name:var(--font-pixel)] text-lg"
          style={{ color: pct === 100 ? "#FFD000" : "#18C840" }}
        >
          %{pct}
        </span>
      </div>

      <div className="h-6 border-2 border-[#101010] bg-[#181838] relative overflow-hidden mb-3">
        <div
          className="absolute inset-y-0 left-0 transition-all duration-500"
          style={{
            width: `${pct}%`,
            background:
              pct === 100
                ? "linear-gradient(90deg,#18C840,#FFD000)"
                : "#18C840",
          }}
        />
        {[25, 50, 75].map((p) => (
          <div
            key={p}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${p}%`, background: "rgba(255,255,255,0.1)" }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-[family-name:var(--font-body)] text-sm"
            style={{ color: pct > 45 ? "#fff" : "#8890B8" }}
          >
            {tamamlanan} / {toplam} konu
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Toplam",     value: toplam,            renk: "#484858" },
          { label: "Tamamlanan", value: tamamlanan,        renk: "#18C840" },
          { label: "Kalan",      value: toplam - tamamlanan, renk: "#E01828" },
        ].map((s) => (
          <div
            key={s.label}
            className="border-2 border-[#D0D0E8] py-2 text-center bg-white"
          >
            <p
              className="font-[family-name:var(--font-pixel)] text-base"
              style={{ color: s.renk }}
            >
              {s.value}
            </p>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#484858]">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
