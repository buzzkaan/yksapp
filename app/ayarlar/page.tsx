"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { SINAV_META, type SinavTipi } from "@/lib/sinav-data";
import { getSinavTipi, setSinavTipi } from "@/lib/utils/sinav";
import { PageHeader } from "@/components/layout/PageHeader";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelButton } from "@/components/pixel/PixelButton";
import toast from "react-hot-toast";

const SINAV_LISTESI: SinavTipi[] = ["YKS", "DGS", "KPSS"];

export default function AyarlarPage() {
  const router = useRouter();
  const { user } = useUser();
  const [secili, setSecili] = useState<SinavTipi>(getSinavTipi);
  const [kaydedildi, setKaydedildi] = useState(false);

  function handleKaydet() {
    setSinavTipi(secili);
    setKaydedildi(true);
    toast.success(`${SINAV_META[secili].isim} seçildi!`);
    setTimeout(() => router.push("/yks"), 800);
  }

  return (
    <div>
      <PageHeader icon="⚙️" title="AYARLAR" subtitle="Trainer ayarlarını yönet" />

      <div className="p-4 flex flex-col gap-4 max-w-4xl mx-auto">
        {/* Profil */}
        <PixelCard>
          <p className="font-[family-name:var(--font-body)] text-xl text-[#101010] mb-3">
            👤 Trainer Profili
          </p>
          <div className="flex items-center gap-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 48, height: 48, border: "4px solid #101010", borderRadius: "0" },
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-[family-name:var(--font-body)] text-lg text-[#101010] truncate">
                {user?.fullName || user?.username || "—"}
              </div>
              <div className="font-[family-name:var(--font-body)] text-sm text-[#585868] truncate">
                {user?.primaryEmailAddress?.emailAddress || "—"}
              </div>
            </div>
          </div>
        </PixelCard>

        {/* Sınav Seçimi */}
        <PixelCard>
          <p className="font-[family-name:var(--font-body)] text-xl text-[#101010] mb-1">
            🎓 Hangi Boss&apos;a Hazırlanıyorsun?
          </p>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#585868] mb-4">
            Seçtiğin sınava göre konular ve içerikler değişir.
          </p>

          <div className="flex flex-col gap-3">
            {SINAV_LISTESI.map((tip) => {
              const meta = SINAV_META[tip];
              const isSecili = secili === tip;
              return (
                <button
                  key={tip}
                  onClick={() => { setSecili(tip); setKaydedildi(false); }}
                  className="w-full border-4 border-[#101010] p-3 text-left transition-all cursor-pointer"
                  style={isSecili ? {
                    backgroundColor: meta.renk,
                    boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.2), 4px 4px 0px 0px #101010",
                  } : {
                    backgroundColor: "#F8F8F0",
                    boxShadow: "3px 3px 0px 0px #101010",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Image src={meta.icon} alt={meta.isim} width={36} height={36} className="w-9 h-9" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-[family-name:var(--font-pixel)] text-xs"
                          style={{ color: isSecili ? "#FFF" : "#101010" }}
                        >
                          {meta.isim}
                        </span>
                        {isSecili && (
                          <span className="font-[family-name:var(--font-body)] text-sm border-2 border-white/60 px-1.5 text-white">
                            ✓ Seçili
                          </span>
                        )}
                      </div>
                      <p
                        className="font-[family-name:var(--font-body)] text-base mt-0.5"
                        style={{ color: isSecili ? "rgba(255,255,255,0.9)" : "#101010" }}
                      >
                        {meta.tamIsim}
                      </p>
                      <p
                        className="font-[family-name:var(--font-body)] text-sm"
                        style={{ color: isSecili ? "rgba(255,255,255,0.75)" : "#585868" }}
                      >
                        {meta.aciklama}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </PixelCard>

        <PixelButton
          variant="primary"
          className="w-full"
          onClick={handleKaydet}
        >
          {kaydedildi ? "✓ Kaydedildi!" : "💾 Kaydet ve Uygula"}
        </PixelButton>

        <div className="border-2 border-dashed border-[#4088F0] bg-[#F0F0F8] px-3 py-2">
          <p className="font-[family-name:var(--font-body)] text-sm text-[#585868]">
            ℹ️ Sınav seçimin yalnızca bu cihazda saklanır. İstediğin zaman değiştirebilirsin.
          </p>
        </div>
      </div>
    </div>
  );
}
