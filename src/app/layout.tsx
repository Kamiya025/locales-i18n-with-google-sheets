import ReactQueryProvider from "@/providers/QueryClientProvider"
import { SpreadsheetProvider } from "@/providers/preadsheetProvider"

import { CustomToaster } from "@/components/ui/toast"
import AuthProvider from "@/providers/AuthProvider"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Footer from "@/components/ui/footer"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Google Sheet Translation Manager",
  description: "Quản lý và dịch Google Sheet dễ dàng, nhanh chóng, tiện lợi.",
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
