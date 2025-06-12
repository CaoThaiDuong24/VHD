"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/contexts/LanguageContext"
import { Menu, X, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function ModernHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { t, language } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/events", label: t("nav.events") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/contact", label: t("nav.contact") },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "glass-nav shadow-elegant" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      {/* Elegant accent line */}
      <div className="h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-500"></div>

      <div className="container mx-auto px-4 lg:px-6">
        {/* Fixed height container to prevent jumping */}
        <div className="flex items-center justify-between h-20">
          {/* Premium Logo Section - Fixed Layout */}
          <Link href="/" className="flex items-center space-x-3 lg:space-x-4 group flex-shrink-0 min-w-0">
            {/* Logo Container - Fixed Size */}
            <div className="relative flex-shrink-0">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

              {/* Logo container */}
              <div className="relative bg-white p-2 lg:p-3 rounded-2xl shadow-elegant group-hover:shadow-luxury transition-all duration-500 group-hover:scale-105 border border-gray-100/50">
                <Image
                  src="/images/rcp-logo.png"
                  alt="RCP Logo"
                  width={32}
                  height={32}
                  className="lg:w-10 lg:h-10 object-contain"
                />

                {/* Sparkle effect */}
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 lg:h-4 lg:w-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* Brand Text Container - Fixed Width and Layout */}
            <div className="group-hover:translate-x-1 transition-transform duration-500 min-w-0 flex-1 max-w-[280px] lg:max-w-[320px]">
              {/* RCP Title - Fixed Height */}
              <div className="flex items-baseline space-x-2 h-8 lg:h-10">
                <span className="text-2xl lg:text-3xl font-display gradient-text-primary whitespace-nowrap flex-shrink-0">
                  RCP
                </span>
                <div className="w-2 h-2 bg-gradient-to-r from-primary to-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
              </div>

              {/* Subtitle - Fixed Height and Consistent Styling */}
              <div className="h-8 lg:h-10 flex items-center">
                <div
                  className={`
                    text-gray-600 font-medium tracking-wide leading-tight
                    overflow-hidden text-ellipsis whitespace-nowrap
                    w-full
                    ${language === "en" ? "text-xs lg:text-sm" : "text-xs lg:text-sm"}
                  `}
                  title={t("header.brand.subtitle")}
                >
                  {t("header.brand.subtitle")}
                </div>
              </div>
            </div>
          </Link>

          {/* Premium Navigation - Standardized Menu Items */}
          <nav className="hidden xl:flex items-center">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex items-center justify-center
                  h-12 px-6 mx-1
                  text-base font-semibold
                  text-gray-700 hover:text-primary
                  transition-all duration-300
                  group whitespace-nowrap
                  ${pathname === item.href ? "text-primary" : ""}
                `}
              >
                {/* Background hover effect - positioned absolutely to not affect layout */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Text - centered and consistent */}
                <span className="relative z-10 text-center">{item.label}</span>

                {/* Active/Hover indicator - positioned absolutely */}
                <div
                  className={`
                    absolute bottom-1 left-1/2 transform -translate-x-1/2
                    h-1 bg-gradient-to-r from-primary to-emerald-500 rounded-full
                    transition-all duration-300
                    ${pathname === item.href ? "w-8 opacity-100" : "w-0 group-hover:w-6 opacity-0 group-hover:opacity-100"}
                  `}
                ></div>

                {/* Glow effect - positioned absolutely */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </Link>
            ))}
          </nav>

          {/* Premium Right Section */}
          <div className="flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
            {/* Language Switcher */}
            <div className="hidden lg:flex items-center">
              <div className="glass-card rounded-xl p-2">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Premium CTA Button - Fixed size */}
            <div className="hidden lg:block">
              <Button className="btn-primary h-12 px-6 rounded-xl font-semibold shadow-elegant hover:shadow-luxury transition-all duration-300 transform hover:scale-105 text-base whitespace-nowrap">
                <BookOpen className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>{t("header.cta")}</span>
              </Button>
            </div>

            {/* Mobile Menu Button - Fixed size */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden w-12 h-12 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"
                  }`}
                />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Mobile Menu */}
      <div
        className={`xl:hidden transition-all duration-500 ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="glass-card border-t border-gray-100/50 shadow-luxury">
          <div className="px-6 py-8 space-y-6">
            {/* Mobile Navigation - Standardized Items */}
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center justify-between
                    h-14 px-4 rounded-xl
                    text-lg font-semibold
                    transition-all duration-300
                    ${
                      pathname === item.href
                        ? "text-primary bg-primary/5"
                        : "text-gray-700 hover:text-primary hover:bg-primary/5"
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex-1 whitespace-nowrap">{item.label}</span>
                  {pathname === item.href && (
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-emerald-500 rounded-full flex-shrink-0"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Language Switcher */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between h-12">
                <span className="text-gray-600 font-medium whitespace-nowrap">{t("header.language")}</span>
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile CTA - Fixed height */}
            <div className="pt-4">
              <Button className="w-full h-14 btn-primary rounded-xl font-semibold shadow-elegant">
                <BookOpen className="mr-2 h-5 w-5 flex-shrink-0" />
                <span className="whitespace-nowrap">{t("header.cta.mobile")}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
