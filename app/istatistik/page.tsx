export const dynamic = "force-dynamic";

import { PixelCard } from "@/components/pixel/PixelCard";
import { PixelLineChart } from "@/components/pixel/PixelLineChart";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { getIstatistik } from "@/server/actions/istatistik";

export default async function IstatistikPage() {
  const istatistik = await getIstatistik();

  const pomodoroChartData = istatistik.grafik.map(g => ({
    label: g.label,
    value: Math.round(g.dakika / 60 * 10) / 10,
  })).slice(-14);

  const gorevChartData = istatistik.grafik.map(g => ({
    label: g.label,
    value: g.gorevTamam,
  })).slice(-14);

  return (
    <>
      <PageHeader icon="📊" title="İSTATİSTİKLER" subtitle="Performans analizi" />
      <PageContainer>

          {/* Pomodoro Özeti */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <PixelCard variant="dark" className="p-3 text-center">
              <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">BUGÜN</div>
              <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#E01828" }}>
                {istatistik.pomodoro.gunluk.sayi}
              </div>
              <div className="font-[family-name:var(--font-body)] text-xs text-[#606878]">
                {Math.round(istatistik.pomodoro.gunluk.dakika / 60 * 10) / 10} saat
              </div>
            </PixelCard>
            <PixelCard variant="dark" className="p-3 text-center">
              <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">HAFTA</div>
              <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#F89000" }}>
                {istatistik.pomodoro.hafta.sayi}
              </div>
              <div className="font-[family-name:var(--font-body)] text-xs text-[#606878]">
                {Math.round(istatistik.pomodoro.hafta.dakika / 60 * 10) / 10} saat
              </div>
            </PixelCard>
            <PixelCard variant="dark" className="p-3 text-center">
              <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">AY</div>
              <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#2878F8" }}>
                {istatistik.pomodoro.ay.sayi}
              </div>
              <div className="font-[family-name:var(--font-body)] text-xs text-[#606878]">
                {Math.round(istatistik.pomodoro.ay.dakika / 60 * 10) / 10} saat
              </div>
            </PixelCard>
            <PixelCard variant="dark" className="p-3 text-center">
              <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">YIL</div>
              <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#18C840" }}>
                {istatistik.pomodoro.yil.sayi}
              </div>
              <div className="font-[family-name:var(--font-body)] text-xs text-[#606878]">
                {Math.round(istatistik.pomodoro.yil.dakika / 60 * 10) / 10} saat
              </div>
            </PixelCard>
          </div>

          {/* Pomodoro Grafik */}
          {pomodoroChartData.length > 1 && (
            <PixelCard>
              <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
                📊 Pomodoro (son 14 gün)
              </p>
              <div className="overflow-x-auto">
                <PixelLineChart data={pomodoroChartData} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-[family-name:var(--font-body)] text-xs text-[#484858]">
                  {pomodoroChartData[0]?.label}
                </span>
                <span className="font-[family-name:var(--font-body)] text-xs text-[#484858]">
                  {pomodoroChartData[pomodoroChartData.length - 1]?.label}
                </span>
              </div>
            </PixelCard>
          )}

          {/* Görev Özeti */}
          <div className="grid grid-cols-3 gap-2">
            <PixelCard variant="dark" className="p-3 text-center">
              <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">BUGÜN</div>
              <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#18C840" }}>
                {istatistik.gorev.gunluk.tamamlanan}/{istatistik.gorev.gunluk.toplam}
              </div>
            </PixelCard>
            <PixelCard variant="dark" className="p-3 text-center">
              <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">HAFTA</div>
              <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#F89000" }}>
                {istatistik.gorev.hafta.tamamlanan}/{istatistik.gorev.hafta.toplam}
              </div>
            </PixelCard>
            <PixelCard variant="dark" className="p-3 text-center">
              <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">AY</div>
              <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#2878F8" }}>
                {istatistik.gorev.ay.tamamlanan}/{istatistik.gorev.ay.toplam}
              </div>
            </PixelCard>
          </div>

          {/* Görev Grafik */}
          {gorevChartData.length > 1 && (
            <PixelCard>
              <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
                ✅ Tamamlanan Görevler (son 14 gün)
              </p>
              <div className="overflow-x-auto">
                <PixelLineChart data={gorevChartData} color="#18C840" />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-[family-name:var(--font-body)] text-xs text-[#484858]">
                  {gorevChartData[0]?.label}
                </span>
                <span className="font-[family-name:var(--font-body)] text-xs text-[#484858]">
                  {gorevChartData[gorevChartData.length - 1]?.label}
                </span>
              </div>
            </PixelCard>
          )}

          {/* Konu İlerleme */}
          <PixelCard>
            <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
              📚 Konu İlerlemesi
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-4 border-2 border-[#101010]" style={{ background: "#E8E8E8" }}>
                <div 
                  className="h-full transition-all"
                  style={{ 
                    width: `${istatistik.konu.yuzde}%`,
                    background: "#18C840"
                  }}
                />
              </div>
              <div className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#18C840" }}>
                %{istatistik.konu.yuzde}
              </div>
            </div>
            <div className="font-[family-name:var(--font-body)] text-sm text-[#606878] mt-2">
              {istatistik.konu.tamamlanan} / {istatistik.konu.toplam} konu tamamlandı
            </div>
          </PixelCard>

          {/* Deneme İstatistikleri */}
          <PixelCard>
            <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
              📝 Deneme İstatistikleri
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-[#D0D0E8] px-3 py-2" style={{ background: "#F0E8D0" }}>
                <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">TOPLAM DENEME</div>
                <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#2878F8" }}>
                  {istatistik.deneme.toplam}
                </div>
              </div>
              <div className="border-2 border-[#D0D0E8] px-3 py-2" style={{ background: "#F0E8D0" }}>
                <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">ORTALAMA NET</div>
                <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#18C840" }}>
                  {istatistik.deneme.ortalamaNet.toFixed(1)}
                </div>
              </div>
              <div className="border-2 border-[#D0D0E8] px-3 py-2" style={{ background: "#F0E8D0" }}>
                <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">EN YÜKSEK NET</div>
                <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#FFD000" }}>
                  {istatistik.deneme.enYuksek.toFixed(1)}
                </div>
              </div>
              <div className="border-2 border-[#D0D0E8] px-3 py-2" style={{ background: "#F0E8D0" }}>
                <div className="font-[family-name:var(--font-pixel)] text-[8px] text-[#606878]">TYT / AYT</div>
                <div className="font-[family-name:var(--font-pixel)] text-2xl" style={{ color: "#E01828" }}>
                  {istatistik.deneme.tytSayi} / {istatistik.deneme.aytSayi}
                </div>
              </div>
            </div>
          </PixelCard>

          {/* Deneme Grafik */}
          {istatistik.denemeGrafik.length > 1 && (
            <PixelCard>
              <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
                📈 Net Trendi
              </p>
              <div className="overflow-x-auto">
                <PixelLineChart data={istatistik.denemeGrafik.map(d => ({ label: d.label, value: d.net }))} />
              </div>
            </PixelCard>
          )}
      </PageContainer>
    </>
  );
}
