import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "DropMasters | Dropshipping Inteligente & Monetização Digital",
  description: "Crie sua loja de dropshipping com custo zero. Automação total, catálogo inteligente, monetização com AdSense e links de afiliados em uma única plataforma premium.",
  keywords: ["dropshipping", "ecommerce", "monetização", "renda extra", "venda online", "afiliados"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
