import type { Metadata } from "next";
// TypeScript may complain about side-effect CSS imports in some setups.
// @ts-ignore
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "FacultiQ — Faculty Management Portal",
  description: "Modern faculty management for educational institutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
        </Providers>

        <Toaster
          position="top-right"
          theme="system"
          toastOptions={{
            classNames: {
              toast:
                "border border-border bg-card text-card-foreground",
              title: "text-sm font-medium",
              description: "text-xs text-muted-foreground",
            },
          }}
        />
      </body>
    </html>
  );
}