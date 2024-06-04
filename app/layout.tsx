import "../styles/globals.css";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {ThemeProvider} from "@/components/ThemeProvider";
import {NextAuthProvider} from "@/components/NextAuthProvider";
import QueryProvider from "@/components/QueryProvider";
import {Toaster} from "@/components/ui/toaster";
import NavBar from "@/components/nav/NavBar";
import {cn} from "@/lib/utils";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import {Suspense} from "react";
import Sidebar from "@/components/layout/sidebar";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "echo",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased light", inter.className)}
    >
      <body className="overflow-hidden">
        <QueryProvider>
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense>
                <ProgressBarProvider>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <NavBar />
                    <main className="pt-12 w-full ">{children}</main>
                  </div>
                </ProgressBarProvider>
              </Suspense>
            </ThemeProvider>
          </NextAuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
