import { EB_Garamond } from "next/font/google";
import type { Metadata } from "next";
import "./_components/alchemy.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reinventing the Wheel · reComposer",
  description:
    "A materials-and-actions lab for rediscovering everyday inventions, with breakdowns and process hints.",
};

export default function TishaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${ebGaramond.variable} alchemy-page flex h-dvh min-h-0 flex-1 flex-col overflow-hidden`}
      style={{
        color: "#1a1510",
        fontFamily: "var(--font-eb-garamond), Georgia, serif",
      }}
    >
      {children}
    </div>
  );
}
