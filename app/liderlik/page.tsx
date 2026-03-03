export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { PixelCard } from "@/components/pixel/PixelCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { SINAV_META, type SinavTipi } from "@/lib/sinav-data";
import { getSinavTipi } from "@/lib/utils/sinav";

// ─── Tipler ───────────────────────────────────────────────────────────────────

type UserRow = {
  userId: string;
  sinavTipi: string;
  yksXp: number; yksSeviye: number;
  dgsXp: number; dgsSeviye: number;
  kpssXp: number; kpssSeviye: number;
  xp: number; seviye: number;
};

type UserInfo = { name: string; imageUrl: string };

function getScore(user: UserRow, sinav: string) {
  if (sinav === "DGS")  return { xp: user.dgsXp,  seviye: user.dgsSeviye  };
  if (sinav === "KPSS") return { xp: user.kpssXp, seviye: user.kpssSeviye };
  return { xp: user.yksXp, seviye: user.yksSeviye };
}

function buildLeaderboard(users: UserRow[], sinav: string) {
  return users
    .map((u) => ({ ...u, ...getScore(u, sinav) }))
    .sort((a, b) => b.xp - a.xp);
}

function rankOf(lb: ReturnType<typeof buildLeaderboard>, userId: string) {
  const i = lb.findIndex((u) => u.userId === userId);
  return i === -1 ? 0 : i + 1;
}

const SINAV_LIST: SinavTipi[] = ["YKS", "DGS", "KPSS"];

// ─── Yardımcı ─────────────────────────────────────────────────────────────────

// Seviyeye göre pixel avatar ikonu
function avatarIcon(seviye: number): string {
  if (seviye >= 20) return "👑";
  if (seviye >= 10) return "⚔️";
  if (seviye >= 5)  return "🏹";
  return "🧙";
}

// ─── Sayfa ────────────────────────────────────────────────────────────────────

export default async function LiderlikPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  const userId    = await requireUserId();
  const meClerk   = await currentUser();

  const myName =
    [meClerk?.firstName, meClerk?.lastName].filter(Boolean).join(" ") ||
    meClerk?.username ||
    meClerk?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "Sen";

  const myImageUrl = meClerk?.imageUrl ?? "";

  const currentSinav = getSinavTipi();
  const activeTab    = (tab as SinavTipi) || currentSinav;

  // DB
  const [currentUser_db, users] = await Promise.all([
    db.userAyarlar.findUnique({ where: { userId } }) as Promise<UserRow | null>,
    db.userAyarlar.findMany({ orderBy: { xp: "desc" }, take: 100 }) as Promise<UserRow[]>,
  ]);

  // Liderlik tabloları
  const yksLb  = buildLeaderboard(users, "YKS");
  const dgsLb  = buildLeaderboard(users, "DGS");
  const kpssLb = buildLeaderboard(users, "KPSS");

  const activeLb =
    activeTab === "DGS" ? dgsLb : activeTab === "KPSS" ? kpssLb : yksLb;

  const myRank = {
    YKS:  rankOf(yksLb,  userId),
    DGS:  rankOf(dgsLb,  userId),
    KPSS: rankOf(kpssLb, userId),
  };

  // Clerk: ilk 20 kullanıcının isim + fotoğrafı
  const top20Ids = activeLb.slice(0, 20).map((u) => u.userId);
  const clerk    = await clerkClient();
  const { data: clerkUsers } = await clerk.users.getUserList({
    userId: top20Ids,
    limit:  20,
  });

  const infoMap = new Map<string, UserInfo>();
  for (const u of clerkUsers) {
    const name =
      [u.firstName, u.lastName].filter(Boolean).join(" ") ||
      u.username ||
      u.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
      "Anonim";
    infoMap.set(u.id, { name, imageUrl: u.imageUrl ?? "" });
  }
  infoMap.set(userId, { name: myName, imageUrl: myImageUrl });

  const activeScore = currentUser_db
    ? getScore(currentUser_db, activeTab)
    : { xp: 0, seviye: 1 };
  const activeRank = myRank[activeTab];
  const xpToNext   = 100 - (activeScore.xp % 100);

  return (
    <>
      <PageHeader
        icon="🏆"
        title="LİDERLİK TABLOSU"
        subtitle={`${myName} · #${activeRank || "?"} sırada (${activeTab})`}
      />
      <PageContainer>

        {/* ── Sınav Seçim Tabları ── */}
        <div
          className="grid grid-cols-3 border-4 border-[#000000] overflow-hidden"
          style={{ boxShadow: "4px 4px 0 0 #000000" }}
        >
          {SINAV_LIST.map((sinav) => {
            const meta     = SINAV_META[sinav];
            const isActive = activeTab === sinav;
            const rank     = myRank[sinav];
            return (
              <Link
                key={sinav}
                href={`/liderlik?tab=${sinav}`}
                className="py-3 flex flex-col items-center gap-1 border-r-4 last:border-r-0 border-[#000000] transition-all"
                style={isActive ? { background: meta.renk } : { background: "#000058" }}
              >
                <div className="w-8 h-8 relative">
                  <Image
                    src={meta.icon}
                    alt={sinav}
                    fill
                    className="object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <span
                  className="font-[family-name:var(--font-pixel)] text-xs"
                  style={{ color: isActive ? "#fff" : "#A8C8F8" }}
                >
                  {sinav}
                </span>
                <span
                  className="font-[family-name:var(--font-body)] text-sm"
                  style={{ color: isActive ? "rgba(255,255,255,0.85)" : "#6878A8" }}
                >
                  #{rank || "—"}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ── Benim Kartım ── */}
        <PixelCard>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {myImageUrl ? (
                <div
                  className="w-14 h-14 overflow-hidden border-4 border-[#FFD000]"
                  style={{ boxShadow: "3px 3px 0 0 #504000" }}
                >
                  <Image
                    src={myImageUrl}
                    alt={myName}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div
                  className="w-14 h-14 flex items-center justify-center text-3xl border-4 border-[#FFD000]"
                  style={{ background: "#000058", boxShadow: "3px 3px 0 0 #804000" }}
                >
                  {avatarIcon(activeScore.seviye)}
                </div>
              )}
              {/* Rank badge */}
              <div
                className="absolute -bottom-1.5 -right-1.5 font-[family-name:var(--font-pixel)] text-[8px] px-1.5 py-0.5 border-2 border-[#000000]"
                style={{ background: "#FFD000", color: "#000000" }}
              >
                #{activeRank || "?"}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <div>
                  <p className="font-[family-name:var(--font-body)] text-xl text-[#000000] leading-tight">
                    {myName}
                  </p>
                  <p
                    className="font-[family-name:var(--font-pixel)] text-[9px]"
                    style={{ color: "#FFD000" }}
                  >
                    SEVİYE {activeScore.seviye} · {activeTab}
                  </p>
                </div>
                <span
                  className="font-[family-name:var(--font-body)] text-sm flex-shrink-0"
                  style={{ color: "#6878A8" }}
                >
                  {activeLb.length} oyuncu
                </span>
              </div>

              {/* XP Bar */}
              <div className="h-3 border-2 border-[#FFD000] bg-[#000058] relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 transition-all"
                  style={{ width: `${activeScore.xp % 100}%`, background: "#FFD000" }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#6878A8" }}>
                  {activeScore.xp} XP
                </span>
                <span className="font-[family-name:var(--font-body)] text-xs" style={{ color: "#00A800" }}>
                  +{xpToNext} XP → seviye atla
                </span>
              </div>
            </div>
          </div>
        </PixelCard>

        {/* ── Liderlik Tablosu ── */}
        <PixelCard>
          <p className="font-[family-name:var(--font-body)] text-lg text-[#000000] mb-3">
            🏅 {activeTab} Sıralaması
          </p>

          {activeLb.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">👥</p>
              <p className="font-[family-name:var(--font-body)] text-lg text-[#6878A8]">
                Henüz {activeTab} oyuncusu yok
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {activeLb.slice(0, 20).map((user, i) => {
                const isMe  = user.userId === userId;
                const rank  = i + 1;
                const info  = infoMap.get(user.userId);
                const name  = info?.name ?? `Oyuncu ${rank}`;
                const imgUrl = info?.imageUrl ?? "";
                const medal  = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

                return (
                  <div
                    key={user.userId}
                    className="flex items-center gap-3 px-3 py-2 border-2"
                    style={{
                      borderColor: isMe ? "#FFD000" : "#000000",
                      background:  isMe ? "#000030" : rank <= 3 ? "#000058" : "#000040",
                      boxShadow:   isMe ? "2px 2px 0 0 #804000" : "none",
                    }}
                  >
                    {/* Sıra */}
                    <div className="w-7 text-center flex-shrink-0">
                      {medal ? (
                        <span className="text-lg leading-none">{medal}</span>
                      ) : (
                        <span
                          className="font-[family-name:var(--font-pixel)] text-[9px]"
                          style={{ color: "#6878A8" }}
                        >
                          #{rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-9 h-9 flex-shrink-0 overflow-hidden border-2"
                      style={{ borderColor: isMe ? "#FFD000" : "#000000" }}
                    >
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={name}
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-base"
                          style={{ background: "#000058" }}
                        >
                          {avatarIcon(user.seviye)}
                        </div>
                      )}
                    </div>

                    {/* İsim + Seviye */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-[family-name:var(--font-body)] text-lg leading-tight truncate"
                          style={{ color: isMe ? "#FFD000" : "#A8C8F8" }}
                        >
                          {name}
                        </span>
                        {isMe && (
                          <span
                            className="font-[family-name:var(--font-pixel)] text-[8px] px-1 py-0.5 flex-shrink-0"
                            style={{ background: "#FFD000", color: "#000000" }}
                          >
                            SEN
                          </span>
                        )}
                      </div>
                      <span
                        className="font-[family-name:var(--font-pixel)] text-[9px]"
                        style={{ color: "#6878A8" }}
                      >
                        Sv. {user.seviye}
                      </span>
                    </div>

                    {/* XP */}
                    <div className="text-right flex-shrink-0">
                      <span
                        className="font-[family-name:var(--font-pixel)] text-sm block"
                        style={{ color: rank === 1 ? "#FFD000" : "#00A800" }}
                      >
                        {user.xp} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </PixelCard>

      </PageContainer>
    </>
  );
}
