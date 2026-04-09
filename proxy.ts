import { clerkMiddleware } from "@clerk/nextjs/server";

// Tüm sayfalar herkese açık — kullanıcılar giriş yapmadan gezebilir.
// Korumayı, yazma işlemlerini yapan sunucu aksiyonları `requireUserId()`
// ile hâlâ sağlıyor; böylece bir özellik kullanılmak istendiğinde kullanıcı
// doğal olarak giriş/kayıt sayfasına yönlendirilmiş olur.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
