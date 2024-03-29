import type { Metadata } from "next";
import { Limelight } from "next/font/google";
import { Suspense } from "react";

const limelight = Limelight({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RSTC",
  description: "This is the portfolio site of Nakashima, a member of Ritsuan STC Inc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/icon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous" />
      </head>
      <body className={limelight.className}>
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
