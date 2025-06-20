"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/contexts/LanguageContext"
import { Menu, X, BookOpen, Sparkles, Home, Info, Newspaper, Calendar, FolderOpen, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

export default function ModernHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { t, language } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Enhanced menu items with icons for better visual identification
  const menuItems = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/about", label: t("nav.about"), icon: Info },
    { href: "/news", label: t("nav.news"), icon: Newspaper },
    { href: "/events", label: t("nav.events"), icon: Calendar },
    { href: "/projects", label: t("nav.projects"), icon: FolderOpen },
    { href: "/contact", label: t("nav.contact"), icon: Phone },
  ]

  // Function to check if current path matches menu item
  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "glass-nav shadow-elegant" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      {/* Elegant accent line */}
      <div className="h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-500"></div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Compact mobile height, normal desktop height */}
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Premium Logo Section - Fixed Layout */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 group flex-shrink-0 min-w-0">
            {/* Logo Container - Responsive Size */}
            <div className="relative flex-shrink-0">
              {/* Glow effect - hidden on mobile for cleaner look */}
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-primary to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

              {/* Logo container - more compact on mobile */}
              <div className="relative bg-white p-1.5 sm:p-2 lg:p-3 rounded-xl sm:rounded-2xl shadow-elegant group-hover:shadow-luxury transition-all duration-500 group-hover:scale-105 border border-gray-100/50">
                <Image
                  src="/images/rcp-logo.png"
                  alt={t("brand.logo.alt")}
                  width={28}
                  height={28}
                  className="sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain"
                />

                {/* Sparkle effect - hidden on mobile */}
                <Sparkles className="hidden sm:block absolute -top-1 -right-1 h-3 w-3 lg:h-4 lg:w-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* Brand Text Container - Mobile Optimized */}
            <div className="group-hover:translate-x-1 transition-transform duration-500 min-w-0 flex-1 max-w-[200px] sm:max-w-[280px] lg:max-w-[400px] xl:max-w-[450px]">
              {/* RCP Title - Responsive Height */}
              <div className="flex items-baseline space-x-1.5 sm:space-x-2 h-6 sm:h-8 lg:h-10">
                <span className="text-xl sm:text-2xl lg:text-3xl font-display gradient-text-primary whitespace-nowrap flex-shrink-0">
                  RCP
                </span>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-primary to-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
              </div>

              {/* Subtitle - Mobile Optimized */}
              <div className="h-5 sm:h-6 lg:h-10 flex items-center">
                <div
                  className="text-gray-600 font-medium tracking-wide leading-tight text-xs sm:text-xs lg:text-sm w-full break-words"
                  title={t("header.brand.subtitle")}
                >
                  {t("header.brand.subtitle")}
                </div>
              </div>
            </div>
          </Link>

          {/* Clean Premium Navigation */}
          <nav className="hidden xl:flex items-center">
            {menuItems.map((item, index) => {
              const isActive = isActiveRoute(item.href)
              const IconComponent = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex items-center justify-center
                    h-12 px-4 mx-1
                    text-sm
                    transition-all duration-300
                    group whitespace-nowrap rounded-lg
                    ${isActive 
                      ? "text-primary font-bold" 
                      : "text-gray-600 hover:text-primary hover:bg-gray-50 font-medium"
                    }
                  `}
                >
                  {/* Text Container */}
                  <div className="flex items-center">
                    <span className={isActive ? "text-base" : ""}>{item.label}</span>
                  </div>

                  {/* Simple Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Premium Right Section - Mobile Optimized */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
            {/* Language Switcher - Hidden on small mobile */}
            <div className="hidden sm:hidden lg:flex items-center">
              <div className="glass-card rounded-xl p-2">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Premium CTA Button - Hidden on mobile for cleaner look */}
            <div className="hidden lg:block">
              <Button 
                className="btn-primary h-12 px-6 rounded-xl font-semibold shadow-elegant hover:shadow-luxury transition-all duration-300 transform hover:scale-105 text-base whitespace-nowrap"
                onClick={() => {
                  console.log('Desktop CTA button clicked - navigating to contact')
                  router.push('/contact')
                }}
              >
                <BookOpen className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>{t("header.cta")}</span>
              </Button>
            </div>

            {/* Mobile Menu Button - Compact size */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden w-10 h-10 sm:w-12 sm:h-12 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg sm:rounded-xl transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative w-5 h-5 sm:w-6 sm:h-6">
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

      {/* Clean Premium Mobile Menu */}
      <div
        className={`xl:hidden transition-all duration-500 ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="glass-card border-t border-gray-100/50 shadow-luxury">
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Clean Mobile Navigation */}
            <div className="space-y-1 sm:space-y-2">
              {menuItems.map((item, index) => {
                const isActive = isActiveRoute(item.href)
                const IconComponent = item.icon
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center justify-between
                      h-10 sm:h-12 px-3 sm:px-4 rounded-lg
                      text-sm sm:text-base
                      transition-all duration-300
                      ${isActive
                        ? "text-primary font-bold"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50 font-medium"
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <span className={isActive ? "text-base sm:text-lg" : ""}>{item.label}</span>
                    </div>
                    
                    {/* Simple active indicator */}
                    {isActive && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Simple Current Page Indicator - More compact */}
            <div className="pt-2 sm:pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600">
                  {t("language.current")} 
                  <span className="text-primary font-medium ml-1">
                    {menuItems.find(item => isActiveRoute(item.href))?.label || t("nav.home")}
                  </span>
                </span>
              </div>
            </div>

            {/* Mobile Language Switcher - More compact */}
            <div className="pt-1 sm:pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between h-10 sm:h-12">
                <span className="text-sm sm:text-base text-gray-600 font-medium whitespace-nowrap">{t("header.language")}</span>
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile CTA - More compact */}
            <div className="pt-2 sm:pt-4">
              <Button 
                className="w-full h-12 sm:h-14 btn-primary rounded-xl font-semibold shadow-elegant text-sm sm:text-base"
                onClick={() => {
                  console.log('Mobile CTA button clicked - navigating to contact')
                  router.push('/contact')
                  setIsMenuOpen(false)
                }}
              >
                <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="whitespace-nowrap">{t("header.cta.mobile")}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

    </header>
  )
}
