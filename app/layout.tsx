import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { UserGuideModal } from "@/components/user-guide-modal"
import { LanguageSelector } from "@/components/language-selector"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "EduFlow - Smart Classroom Management",
  description: "AI-powered timetable management, attendance tracking, and class transcription system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-inter ${inter.variable}`}>
        <UserGuideModal />
        <LanguageSelector />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
