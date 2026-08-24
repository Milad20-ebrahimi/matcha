import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { AuthProvider } from "@/features/auth/auth.context";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: {
    default: "MATCH--CAFE | تجربه اصیل ماچا و قهوه",
    template: "%s | MATCH--CAFE",
  },

  description:
    "کافه و فروشگاه تخصصی ماچا، چای، قهوه و ابزارهای دم‌آوری پریمیوم",

  keywords: [
    "Matcha",
    "Coffee",
    "Tea",
    "Cafe",
    "ماچا",
    "قهوه",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white text-slate-900">

        <AuthProvider>

          <Navbar />

          <main className="flex-1">
            {children}
          </main>

        </AuthProvider>
        <Footer/>
      </body>
    </html>
  );
}
