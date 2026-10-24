import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eunoia Education ",
  description: "Welcome to Eunoia Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
