"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";

/**
 * Client-side auth gate.
 *
 * `requireAuth(fn)` runs `fn` only if the user is signed in. Otherwise it
 * shows a toast and redirects to `/sign-in`.
 *
 * Use this to wrap write handlers so that users can browse freely, and the
 * sign-in flow only appears when they actually try to use a feature.
 */
export function useAuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const requireAuth = useCallback(
    (fn?: () => void | Promise<void>) => {
      if (!isLoaded) return false;
      if (!isSignedIn) {
        toast("🔐 Bu özelliği kullanmak için giriş yap", { icon: "⚡" });
        router.push("/sign-in");
        return false;
      }
      void fn?.();
      return true;
    },
    [isLoaded, isSignedIn, router],
  );

  return { isSignedIn: !!isSignedIn, requireAuth };
}
