"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { LS_SINAV_KEY, SINAV_META, type SinavTipi } from "@/lib/sinav-data";
import { PageHeader } from "@/components/layout/PageHeader";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelButton } from "@/components/pixel/PixelButton";
import toast from "react-hot-toast";

const SINAV_LISTESI: SinavTipi[] = ["YKS", "DGS", "KPSS"];

export default function AyarlarPage() {
  const router = useRouter();
  const { user } = useUser();
  const [secili, setSecili] = useState<SinavTipi>("YKS");
  const [kaydedildi, setKaydedildi] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LS_SINAV_KEY) as SinavTipi | null;
    if (stored && SINAV_LISTESI.includes(stored)) {
      setSecili(stored);
    }
  }, []);

  function handleKaydet() {
    localStorage.setItem(LS_SINAV_KEY, secili);
    setKaydedildi(true);
    toast.success(`${SINAV_META[secili].icon} ${SINAV_META[secili].isim} seçildi!`);
    setTimeout(() => router.push("/yks"), 800);
  }

  return (
    <div>
      <PageHeader icon="⚙️" title="AYARLAR" subtitle="Sınav ve tercihlerini ayarla" />

      <div className="p-4 flex flex-col gap-4">
        {/* Profil */}
        <PixelCard>
          <p className="font-[family-name:var(--font-body)] text-xl text-[#101010] mb-3">
            👤 Profil
          </p>
          <div className="flex items-center gap-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 48, height: 48, border: "3px solid #4060D0", borderRadius: "0" },
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-[family-name:var(--font-body)] text-lg text-[#101010] truncate">
                {user?.fullName || user?.username || "—"}
              </div>
              <div className="font-[family-name:var(--font-body)] text-sm text-[#505068] truncate">
                {user?.primaryEmailAddress?.emailAddress || "—"}
              </div>
            </div>
          </div>
        </PixelCard>

        {/* Sınav Seçimi */}
        <PixelCard>
          <p className="font-[family-name:var(--font-body)] text-xl text-[#101010] mb-1">
            🎓 Hangi Sınava Çalışıyorsun?
          </p>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#505068] mb-4">
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
                  className={`w-full border-4 p-3 text-left transition-all ${
                    isSecili
                      ? "border-[#101010] shadow-none translate-y-0.5"
                      : "border-[#A0A8C0] shadow-[3px_3px_0px_0px_#101010] hover:border-[#505068]"
                  }`}
                  style={isSecili ? { backgroundColor: meta.renk } : { backgroundColor: "#FFFFFF" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{meta.icon}</span>
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
                        style={{ color: isSecili ? "rgba(255,255,255,0.75)" : "#505068" }}
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

        {/* Kaydet butonu */}
        <PixelButton
          variant="primary"
          className="w-full"
          onClick={handleKaydet}
        >
          {kaydedildi ? "✓ Kaydedildi!" : "💾 Kaydet ve Uygula"}
        </PixelButton>

        {/* Bilgi */}
        <div className="border-2 border-dashed border-[#4060D0] px-3 py-2 bg-[#E8E8F8]">
          <p className="font-[family-name:var(--font-body)] text-sm text-[#505068]">
            ℹ️ Sınav seçimin yalnızca bu cihazda saklanır. İstediğin zaman değiştirebilirsin.
          </p>
        </div>
      </div>
    </div>
  );
}
