import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "dotenv/config"
import { MainNavigation } from "@/components/navigation";
import { ThemeProvider } from "@/contexts/themeContext";
import { cookies } from "next/headers";
import { Theme } from "@/actions/theme";
import { verifyToken } from "@/proxy";

export const montserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"]
})

export const metadata: Metadata = {
  title: "Tech E-commerce",
  description: "Projeto de E-commerce criado por Arthur Amancio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies()
  const theme = (cookieStore.get("theme")?.value as Theme) ?? "light"
  const token = cookieStore.get("token")?.value ?? null
  const user = token ? await verifyToken(token) : null

return (
    <html lang="pt-br" data-theme={theme}>
        <body className={`${montserratFont.className}`}>
            <ThemeProvider initialTheme={theme}>
                <MainNavigation role={user ? user.role : "client"}/>
                {children}
                <footer>
                    <p>Tech E-commerce by Arthur Amancio</p>
                </footer>
            </ThemeProvider>
        </body>
    </html>
)
}
