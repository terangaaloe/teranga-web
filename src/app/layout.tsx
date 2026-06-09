import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Teranga Aloe — Back-office",
  description: "Espace distributeur Forever Living — commandes, protocoles, produits et suivi clients.",
  icons: { icon: "/app-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={barlow.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
