import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeuDinheiro",
  description: "Base inicial do projeto MeuDinheiro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
