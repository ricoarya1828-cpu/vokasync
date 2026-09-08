import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNavBar } from "@/components/navigation/bottom-nav-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VokaSync - AI Voice & Visual Assistant untuk UMKM",
  description: "Asisten ganda (voice + visual) berbasis AI untuk pencatatan transaksi dan promosi produk UMKM Indonesia",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="min-h-screen bg-background pb-16">
          {/* Main Content Area */}
          <main className="max-w-2xl mx-auto">
            {children}
          </main>
          
          {/* Bottom Navigation - Persistent across all pages */}
          <BottomNavBar />
        </div>
      </body>
    </html>
  );
}
