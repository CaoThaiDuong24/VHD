"use client"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/sections/HeroSection"
import StatsSection from "@/components/sections/StatsSection"
import AboutSection from "@/components/sections/AboutSection"
import VisionMissionSection from "@/components/sections/VisionMissionSection"
import DirectorMessage from "@/components/sections/DirectorMessage"
import PartnersSection from "@/components/sections/PartnersSection"
import NewsSection from "@/components/sections/NewsSection"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <VisionMissionSection />
        <DirectorMessage />
        <PartnersSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  )
}
