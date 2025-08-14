import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Spotify Dashboard - Estadísticas Avanzadas",
    template: "%s | Spotify Dashboard"
  },
  description: "Dashboard avanzado para visualizar tus estadísticas de Spotify con glassmorphism y análisis detallados de tu música.",
  keywords: ["spotify", "dashboard", "estadísticas", "música", "análisis", "glassmorphism"],
  authors: [{ name: "Spotify Dashboard" }],
  creator: "Spotify Dashboard",
  publisher: "Spotify Dashboard",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    title: "Spotify Dashboard - Estadísticas Avanzadas",
    description: "Descubre tus estadísticas de Spotify con un diseño glassmorphism único",
    siteName: "Spotify Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotify Dashboard - Estadísticas Avanzadas",
    description: "Descubre tus estadísticas de Spotify con un diseño glassmorphism único",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
