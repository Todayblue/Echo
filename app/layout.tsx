import "../styles/globals.css";
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";

import { NextAuthProvider } from "@/components/NextAuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/nav/NavBar";
import { cn } from "@/lib/utils";

const lato = Lato({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DogWorld",
  description: "blogs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "bg-white text-slate-900 antialiased light",
        lato.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <QueryProvider>
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NavBar />
              <div className="w-full h-screen">{children}</div>
            </ThemeProvider>
          </NextAuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
