import ReactQueryProvider from "@/providers/QueryClientProvider"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { CustomToaster } from "@/components/ui/toast"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <CustomToaster />
      </body>
    </html>
  )
}
