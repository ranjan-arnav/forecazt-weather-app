import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Forecazt - AI Weather Forecasting",
  description: "Built to make you extraordinarily informed about weather patterns worldwide. Experience the future of weather forecasting with AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
