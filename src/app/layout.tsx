import type { Metadata } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import ReduxProvider from "@/providers/reduxProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transaction Tracker",
  description:
    "Transaction tracker app with real-time analytics, interactive charts, and smart filtering. Track your income, expenses, and visualize spending  effortlessly.",
  keywords: ["expense tracker", "income tracker"],
  authors: [{ name: "Sujan Lama" }],
  openGraph: {
    title: "Transaction Tracker",
    description:
      "Track and visualize your  transactions with interactive charts and real-time analytics",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${robotoMono.variable} antialiased`}
      >
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
