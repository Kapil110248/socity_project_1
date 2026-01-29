import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthInitializer } from "@/components/auth-initializer";
import EmergencyNotificationListener from "@/components/emergency/EmergencyNotificationListener";
import ComplaintNotificationListener from "@/components/complaints/ComplaintNotificationListener";
import ChatNotificationListener from "@/components/chat/ChatNotificationListener";
import ProfileUpdateNotificationListener from "@/components/profile/ProfileUpdateNotificationListener";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IGATESECURITY | Modern Community Living",
  description: "Complete society management solution for modern communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthInitializer />
            <EmergencyNotificationListener />
            <ComplaintNotificationListener />
            <ChatNotificationListener />
            <ProfileUpdateNotificationListener />
            {children}
            <Toaster position="top-right" />
            <SonnerToaster position="top-right" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
