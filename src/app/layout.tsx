import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { DesktopWrapper } from "@/components/desktop-wrapper";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeuDinheiro",
  description: "Controle financeiro pessoal simples e bonito",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DesktopWrapper>
        {children}
        </DesktopWrapper>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#27272a",
              color: "#fafafa",
              border: "1px solid #3f3f46",
            },
          }}
        />
      </body>
    </html>
  );
}
