import ReactQueryProvider from "@/providers/QueryClientProvider"
import { SpreadsheetProvider } from "@/providers/preadsheetProvider"

import { CustomToaster } from "@/components/ui/toast"
import AuthProvider from "@/providers/AuthProvider"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Footer from "@/components/ui/footer"
import GoogleOneTap from "@/components/auth/GoogleOneTap"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Google Sheet Translation Manager",
  description: "Quản lý và dịch Google Sheet dễ dàng, nhanh chóng, tiện lợi.",
  applicationName: "Translate PWA",
  appleWebApp: {
    capable: true,
    title: "Translate PWA",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthProvider>
          <GoogleOneTap />
          <ReactQueryProvider>
            <SpreadsheetProvider>
              <div className="flex flex-col">
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </SpreadsheetProvider>
          </ReactQueryProvider>
        </AuthProvider>
        <CustomToaster />
      </body>
    </html>
  )
}
