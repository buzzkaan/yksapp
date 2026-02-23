"use client";
import { useState } from "react";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { denemeEkle } from "@/server/actions/denemeler";
import { netHesapla } from "@/lib/utils";
import toast from "react-hot-toast";

const TYT_DERSLER = ["Türkçe", "Matematik", "Fen Bilimleri", "Sosyal Bilimler"];
const AYT_DERSLER = ["Matematik", "Fizik", "Kimya", "Biyoloji", "Edebiyat", "Tarih", "Coğrafya"];

type DersDetay = { dersAdi: string; dogru: number; yanlis: number; bos: number };

interface DenemeFormProps {
  onClose: () => void;
}

export function DenemeForm({ onClose }: DenemeFormProps) {
  const [tur, setTur] = useState<"TYT" | "AYT">("TYT");
  const [tarih, setTarih] = useState(new Date().toISOString().split("T")[0]);
  const [dersler, setDersler] = useState<DersDetay[]>(() =>
    TYT_DERSLER.map((d) => ({ dersAdi: d, dogru: 0, yanlis: 0, bos: 0 }))
  );
  const [submitting, setSubmitting] = useState(false);

  function handleTurChange(t: "TYT" | "AYT") {
    setTur(t);
    const liste = t === "TYT" ? TYT_DERSLER : AYT_DERSLER;
    setDersler(liste.map((d) => ({ dersAdi: d, dogru: 0, yanlis: 0, bos: 0 })));
  }

  function updateDers(idx: number, field: keyof Omit<DersDetay, "dersAdi">, val: number) {
    setDersler((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: Math.max(0, val) };
      return next;
    });
  }

  const toplamNet = dersler.reduce(
    (acc, d) => acc + netHesapla(d.dogru, d.yanlis),
    0
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await denemeEkle({ tur, tarih: new Date(tarih), dersler });
      toast.success(`📊 ${tur} denemesi kaydedildi! Net: ${toplamNet.toFixed(2)}`);
      onClose();
    } catch {
      toast.error("Bir hata oluştu!");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PixelCard className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="font-[family-name:var(--font-pixel)] text-xs text-[#101010]">
          Yeni Deneme Ekle
        </h2>

        {/* Tür */}
        <div className="flex gap-2">
          {(["TYT", "AYT"] as const).map((t) => (
            <PixelButton
              key={t}
              type="button"
              variant={tur === t ? "primary" : "ghost"}
              size="sm"
              onClick={() => handleTurChange(t)}
            >
              {t}
            </PixelButton>
          ))}
        </div>

        {/* Tarih */}
        <div>
          <label className="font-[family-name:var(--font-body)] text-lg text-[#101010] block mb-1">
            Tarih:
          </label>
          <input
            type="date"
            value={tarih}
            onChange={(e) => setTarih(e.target.value)}
            className="border-4 border-[#101010] bg-white px-3 py-1 font-[family-name:var(--font-body)] text-lg text-[#101010] w-full outline-none focus:border-[#4088F0]"
          />
        </div>

        {/* Dersler */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-1 font-[family-name:var(--font-body)] text-sm text-[#585868]">
            <span>Ders</span>
            <span className="text-center">Doğru</span>
            <span className="text-center">Yanlış</span>
            <span className="text-center">Boş</span>
          </div>
          {dersler.map((ders, idx) => (
            <div key={ders.dersAdi} className="grid grid-cols-4 gap-1 items-center">
              <span className="font-[family-name:var(--font-body)] text-sm text-[#101010] truncate">
                {ders.dersAdi}
              </span>
              {(["dogru", "yanlis", "bos"] as const).map((field) => (
                <input
                  key={field}
                  type="number"
                  min="0"
                  value={ders[field]}
                  onChange={(e) => updateDers(idx, field, parseInt(e.target.value) || 0)}
                  className="border-4 border-[#101010] bg-white px-1 py-1 font-[family-name:var(--font-body)] text-lg text-center text-[#101010] w-full outline-none focus:border-[#4088F0]"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Toplam net */}
        <div className="border-t-4 border-[#101010] pt-3 flex justify-between items-center">
          <span className="font-[family-name:var(--font-body)] text-lg text-[#101010]">
            Toplam Net:
          </span>
          <span className="font-[family-name:var(--font-pixel)] text-sm text-[#48B848]">
            {toplamNet.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2">
          <PixelButton type="submit" variant="primary" disabled={submitting} className="flex-1">
            {submitting ? "Kaydediliyor..." : "✅ Kaydet"}
          </PixelButton>
          <PixelButton type="button" variant="ghost" onClick={onClose}>
            İptal
          </PixelButton>
        </div>
      </form>
    </PixelCard>
  );
}
