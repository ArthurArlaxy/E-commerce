import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "dotenv/config"
import { MainNavegation } from "@/components/navegation";

export const montserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"]
})

export const metadata: Metadata = {
  title: "Tech E-commerce",
  description: "Projeto de E-commerce criado por Arthur Amancio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className={`${montserratFont.className}`}>
        <MainNavegation/>
        {children}
        <footer>
          <p>Tech E-commerce by Arthur Amancio</p>
        </footer>
      </body>
    </html>
  );
}
