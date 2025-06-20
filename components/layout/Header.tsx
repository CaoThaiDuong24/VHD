"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/contexts/LanguageContext"
import { Menu, X, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  
  // Safely get language context with fallback
  const languageContext = useLanguage()
  const { t, language } = languageContext || { t: (key: string) => key, language: 'vi' }

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
    { href: "/news", label: t("nav.news") },
    { href: "/events", label: t("nav.events") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/contact", label: t("nav.contact") },
  ]

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "glass-nav shadow-elegant" : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-500"></div>

        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-white p-3 rounded-2xl shadow-elegant group-hover:shadow-luxury transition-all duration-500 group-hover:scale-105 border border-gray-100/50">
                  <Image src="/images/rcp-logo.png" alt={t("brand.logo.alt")} width={40} height={40} className="object-contain" />
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              <div className="group-hover:translate-x-1 transition-transform duration-500">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-display gradient-text-primary">RCP</span>
                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div className={`
                  text-sm text-gray-600 font-medium tracking-wide leading-tight
                  ${language === "en" 
                    ? "max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap" 
                    : "max-w-[320px] break-words"
                  }
                `}>
                  {t("header.brand.subtitle")}
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-6 py-3 text-gray-700 hover:text-primary transition-all duration-300 font-semibold group ${
                    pathname === item.href ? "text-primary" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{item.label}</span>
                  <div
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-300 ${
                      pathname === item.href ? "w-8 opacity-100" : "w-0 group-hover:w-6 opacity-0 group-hover:opacity-100"
                    }`}
                  ></div>
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center">
                <div className="glass-card rounded-xl p-2">
                  <LanguageSwitcher />
                </div>
              </div>

              <div className="hidden lg:block">
                <Link href="/contact">
                <Button 
                  className="btn-primary px-6 py-3 rounded-xl font-semibold shadow-elegant hover:shadow-luxury transition-all duration-300 transform hover:scale-105"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t("header.cta")}
                </Button>
                </Link>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-700 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-300"
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

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="glass-card border-t border-gray-100/50 shadow-luxury">
            <div className="px-6 py-8 space-y-6">
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block relative px-4 py-3 text-gray-700 hover:text-primary font-semibold text-lg rounded-xl transition-all duration-300 ${
                      pathname === item.href ? "text-primary bg-primary/5" : "hover:bg-primary/5"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {pathname === item.href && (
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-emerald-500 rounded-full"></div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">{t("header.language")}</span>
                  <LanguageSwitcher />
                </div>
              </div>

              <div className="pt-4">
                <Link href="/contact" className="w-full">
                <Button 
                  className="w-full btn-primary py-4 rounded-xl font-semibold shadow-elegant"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  {t("header.cta.mobile")}
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  )
}
