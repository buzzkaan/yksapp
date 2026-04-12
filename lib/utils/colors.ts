/** Performance renk eşiği — net skorunu renke çevirir (deneme istatistikleri için). */
export function getPerformanceColor(net: number): string {
  if (net > 10) return "#18C840";
  if (net > 5)  return "#F89000";
  return "#E01828";
}
