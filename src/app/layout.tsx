import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BabyFaceGen — See What Your Baby Will Look Like | AI Baby Generator",
  description:
    "Upload photos of both parents and our AI predicts what your future baby will look like. Fun, accurate, and instant results. Try it now!",
  keywords: "AI baby generator, baby face predictor, what will my baby look like, future baby, baby face generator, AI baby face",
  openGraph: {
    title: "BabyFaceGen — See What Your Baby Will Look Like",
    description: "Upload photos of both parents. AI predicts your future baby's face in seconds.",
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
