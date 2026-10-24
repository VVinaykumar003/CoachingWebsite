import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eunoia Education ",
  description: "Welcome to Eunoia Education",
  icons: {
    icon: "/eunoia_logo_high_quality.svg",
    apple: "/kunal_logo_ee2.png",
  },
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
