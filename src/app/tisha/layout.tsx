import { EB_Garamond } from "next/font/google";
import type { Metadata } from "next";
import "./_components/alchemy.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casein Plastic — reComposer",
  description: "A Little Alchemy–style lab for making casein plastic.",
};

export default function TishaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${ebGaramond.variable} alchemy-page min-h-full flex-1`}
      style={{
        color: "#1a1510",
        fontFamily: "var(--font-eb-garamond), Georgia, serif",
      }}
    >
      {children}
    </div>
  );
}
