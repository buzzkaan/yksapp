export const dynamic = "force-dynamic";

import Link from "next/link";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { SINAV_META, type SinavTipi } from "@/lib/sinav-data";
import { getSinavTipi } from "@/lib/utils/sinav";

type UserAyarlarWithScore = {
  userId: string;
  sinavTipi: string;
  yksXp: number;
  yksSeviye: number;
  dgsXp: number;
  dgsSeviye: number;
  kpssXp: number;
  kpssSeviye: number;
  xp: number;
  seviye: number;
};

function getScoreBySinav(user: UserAyarlarWithScore, sinavTipi: string) {
  switch (sinavTipi) {
    case "YKS": return { xp: user.yksXp, seviye: user.yksSeviye };
    case "DGS": return { xp: user.dgsXp, seviye: user.dgsSeviye };
    case "KPSS": return { xp: user.kpssXp, seviye: user.kpssSeviye };
    default: return { xp: user.yksXp, seviye: user.yksSeviye };
  }
}

export default async function LiderlikPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const userId = await requireUserId();
  const currentSinav = getSinavTipi();
  const activeTab = (searchParams.tab as SinavTipi) || currentSinav;
  
  const currentUser = await db.userAyarlar.findUnique({
    where: { userId },
  }) as UserAyarlarWithScore | null;

  const users = await db.userAyarlar.findMany({
    orderBy: { xp: "desc" },
    take: 100,
  }) as UserAyarlarWithScore[];

  const sinavListesi: SinavTipi[] = ["YKS", "DGS", "KPSS"];
  
  const getLeaderboard = (sinavTipi: string) => {
    return users
      .map(u => ({
        userId: u.userId,
        sinavTipi: u.sinavTipi,
        ...getScoreBySinav(u, sinavTipi),
      }))
      .sort((a, b) => b.xp - a.xp);
  };

  const yksLeaderboard = getLeaderboard("YKS");
  const dgsLeaderboard = getLeaderboard("DGS");
  const kpssLeaderboard = getLeaderboard("KPSS");

  const getUserRank = (leaderboard: ReturnType<typeof getLeaderboard>, userId: string) => {
    return leaderboard.findIndex(u => u.userId === userId) + 1;
  };

  const yksRank = getUserRank(yksLeaderboard, userId);
  const dgsRank = getUserRank(dgsLeaderboard, userId);
  const kpssRank = getUserRank(kpssLeaderboard, userId);

  const currentScore = currentUser ? getScoreBySinav(currentUser, activeTab) : { xp: 0, seviye: 1 };
  const currentRank = activeTab === "YKS" ? yksRank : activeTab === "DGS" ? dgsRank : kpssRank;
  const currentLeaderboard = activeTab === "YKS" ? yksLeaderboard : activeTab === "DGS" ? dgsLeaderboard : kpssLeaderboard;
  const currentSinavCount = currentLeaderboard.length;

  const xpToNext = 100 - (currentScore.xp % 100);

  return (
    <>
      <PageHeader icon="🏆" title="LİDERLİK TABLOSU" subtitle={`Sıralaman: #${currentRank} (${activeTab})`} />
      <PageContainer>
          {/* Sınav Seçimi Tabları */}
          <div className="flex gap-1">
            {sinavListesi.map((sinav) => {
              const meta = SINAV_META[sinav];
              const isActive = activeTab === sinav;
              const rank = sinav === "YKS" ? yksRank : sinav === "DGS" ? dgsRank : kpssRank;
              
              return (
                <Link
                  key={sinav}
                  href={`/liderlik?tab=${sinav}`}
                  className="flex-1 py-2 px-3 text-center border-2 transition-all"
                  style={{
                    background: isActive ? meta.renk : "#F0E8D0",
                    borderColor: isActive ? meta.renk : "#D0D0E8",
                    boxShadow: isActive ? "3px 3px 0 0 #101010" : "none",
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">{meta.icon}</span>
                    <span
                      className="font-[family-name:var(--font-pixel)] text-xs"
                      style={{ color: isActive ? "#FFF" : "#101010" }}
                    >
                      {sinav}
                    </span>
                    <span
                      className="font-[family-name:var(--font-body)] text-sm"
                      style={{ color: isActive ? "rgba(255,255,255,0.8)" : "#606878" }}
                    >
                      #{rank || "-"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Kullanıcı Kartı */}
          <PixelCard>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 flex items-center justify-center text-4xl"
                style={{ background: "#FFD000", boxShadow: "3px 3px 0 0 #504000" }}
              >
                🏆
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-[family-name:var(--font-pixel)] text-lg" style={{ color: "#FFD000" }}>
                    SEVİYE {currentScore.seviye}
                  </span>
                  <span className="font-[family-name:var(--font-body)] text-sm" style={{ color: "#606878" }}>
                    #{currentRank} / {currentSinavCount}
                  </span>
                </div>
                <div className="h-3 mt-1 border-2 border-[#FFD000]" style={{ background: "#101010" }}>
                  <div
                    className="h-full transition-all"
                    style={{ width: `${currentScore.xp % 100}%`, background: "#FFD000" }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#606878" }}>
                    {currentScore.xp} XP
                  </span>
                  <span className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#18C840" }}>
                    {xpToNext} XP sonra seviye atla!
                  </span>
                </div>
              </div>
            </div>
          </PixelCard>

          {/* Liderlik Tablosu */}
          <PixelCard>
            <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
              🏅 {activeTab} Sıralaması
            </p>
            
            {currentLeaderboard.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">👥</div>
                <p className="font-[family-name:var(--font-body)] text-lg text-[#606878]">
                  Henüz {activeTab} oyuncusu yok
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {currentLeaderboard.slice(0, 20).map((user, index) => {
                  const isCurrentUser = user.userId === userId;
                  const rank = index + 1;
                  
                  return (
                    <div
                      key={user.userId}
                      className={`flex items-center gap-3 px-3 py-2 border-2 ${
                        isCurrentUser ? "border-[#FFD000]" : "border-[#D0D0E8]"
                      }`}
                      style={{
                        background: isCurrentUser ? "#FFF8E0" : "#F0E8D0",
                      }}
                    >
                      <div
                        className="w-8 h-8 flex items-center justify-center font-[family-name:var(--font-pixel)]"
                        style={{
                          color: rank === 1 ? "#FFD000" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : "#606878",
                        }}
                      >
                        {rank <= 3 ? (rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉") : `#${rank}`}
                      </div>
                      <div className="flex-1">
                        <span
                          className="font-[family-name:var(--font-body)] text-lg"
                          style={{ color: "#101010" }}
                        >
                          {isCurrentUser ? "Sen" : `Oyuncu ${rank}`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className="font-[family-name:var(--font-pixel)] text-sm"
                          style={{ color: "#18C840" }}
                        >
                          {user.xp} XP
                        </span>
                        <div className="font-[family-name:var(--font-pixel)] text-xs" style={{ color: "#606878" }}>
                          Seviye {user.seviye}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </PixelCard>

          {/* Diğer Sınavlardaki Sıralamalar */}
          <PixelCard>
            <p className="font-[family-name:var(--font-body)] text-lg text-[#101010] mb-3">
              📊 Tüm Sınavlardaki Sıralamaların
            </p>
            <div className="grid grid-cols-3 gap-2">
              {sinavListesi.map((sinav) => {
                const meta = SINAV_META[sinav];
                const rank = sinav === "YKS" ? yksRank : sinav === "DGS" ? dgsRank : kpssRank;
                const score = currentUser ? getScoreBySinav(currentUser, sinav) : { xp: 0, seviye: 1 };
                const count = sinav === "YKS" ? yksLeaderboard.length : sinav === "DGS" ? dgsLeaderboard.length : kpssLeaderboard.length;
                
                return (
                  <div
                    key={sinav}
                    className="border-2 px-2 py-2 text-center"
                    style={{ 
                      background: activeTab === sinav ? meta.renk : "#F0E8D0",
                      borderColor: meta.renk,
                    }}
                  >
                    <div className="text-2xl mb-1">{meta.icon}</div>
                    <div 
                      className="font-[family-name:var(--font-pixel)] text-xs"
                      style={{ color: activeTab === sinav ? "#FFF" : "#101010" }}
                    >
                      #{rank || "-"}
                    </div>
                    <div 
                      className="font-[family-name:var(--font-body)] text-xs"
                      style={{ color: activeTab === sinav ? "rgba(255,255,255,0.8)" : "#606878" }}
                    >
                      {score.xp} XP
                    </div>
                    <div 
                      className="font-[family-name:var(--font-pixel)] text-[10px]"
                      style={{ color: activeTab === sinav ? "rgba(255,255,255,0.6)" : "#909090" }}
                    >
                      Seviye {score.seviye}
                    </div>
                  </div>
                );
              })}
            </div>
          </PixelCard>
      </PageContainer>
    </>
  );
}
