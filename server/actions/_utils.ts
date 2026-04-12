import { requireUserId } from "@/lib/auth";

/**
 * Query (veri getirme) action'ları için: auth + try/catch.
 * Hata durumunda fallback döner.
 */
export async function withQuery<T>(
  label: string,
  fn: (userId: string) => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    const userId = await requireUserId();
    return await fn(userId);
  } catch (error) {
    console.error(`[${label}]`, error);
    return fallback;
  }
}

/**
 * Mutation action'ları için: auth + try/catch.
 * Hata durumunda özel mesajla fırlatır.
 */
export async function withMutation(
  label: string,
  errorMessage: string,
  fn: (userId: string) => Promise<void>,
): Promise<void> {
  try {
    const userId = await requireUserId();
    await fn(userId);
  } catch (error) {
    console.error(`[${label}]`, error);
    throw new Error(errorMessage);
  }
}
