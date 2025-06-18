import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { NewsProvider } from "@/contexts/NewsContext"
import { EventsProvider } from "@/contexts/EventsContext"
import NewsNotification from "@/components/ui/NewsNotification"
import ClearStorageButton from "@/components/ui/ClearStorageButton"
import "./globals.css"

// Load Inter font
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
})

// Load Playfair Display font
const playfairDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "RCP - Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản",
  description: "Kết nối tri thức – Lan tỏa văn hóa đọc – Đồng hành cùng sự phát triển ngành xuất bản Việt Nam",
  keywords: "reading culture, publishing, RCP, Vietnam Publishing Association, văn hóa đọc, xuất bản",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="antialiased">
        <NewsProvider>
          <EventsProvider>
            <LanguageProvider>
              {children}
              <NewsNotification />
              {process.env.NODE_ENV === 'development' && <ClearStorageButton />}
            </LanguageProvider>
          </EventsProvider>
        </NewsProvider>
      </body>
    </html>
  )
}
