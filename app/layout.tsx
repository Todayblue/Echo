import "../styles/globals.css";
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";

import { NextAuthProvider } from "@/components/NextAuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/nav/NavBar";

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
    <html lang="en" suppressHydrationWarning>
      <body className={lato.className}>
        <QueryProvider>
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="pb-10">
                <NavBar />
              </div>
              {children}
            </ThemeProvider>
          </NextAuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
