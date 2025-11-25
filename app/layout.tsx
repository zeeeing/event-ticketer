import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Golden Tikkee",
  description: "Your express ride into any event.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            {/* navbar */}
            <nav className="w-full border-b border-b-foreground/10 h-16">
              <div className="container mx-auto flex justify-between items-center h-full px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  <Link href={"/"}>Golden Tikkee</Link>
                </div>
                <div className="flex gap-4 items-center">
                  <Suspense>
                    <AuthButton />
                  </Suspense>
                  <ThemeSwitcher />
                </div>
              </div>
            </nav>

            {/* content */}
            <div className="flex-1 w-full py-10">
              <div className="container mx-auto flex flex-col gap-20 px-5">
                {children}
              </div>
            </div>

            {/* footer */}
            <footer className="w-full border-t">
              <div className="container mx-auto flex items-center justify-center text-center text-xs gap-8 py-12 px-5">
                <p>
                  Powered by{" "}
                  <Link
                    href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Supabase
                  </Link>
                </p>
                <p>
                  <Link
                    href="https://zingjen.vercel.app"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    About Me
                  </Link>
                </p>
              </div>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
