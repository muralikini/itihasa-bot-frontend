import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Itihasa Bot – Ramayana & Mahabharata for Kids",
  description: "A friendly storyteller that teaches children about the Ramayana and Mahabharata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
