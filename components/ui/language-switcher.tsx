"use client"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
      <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage("vi")}
          className={`
            h-8 px-3 py-1 text-xs font-medium rounded-none border-0
            transition-all duration-200
            ${language === "vi" ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}
          `}
        >
          VI
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage("en")}
          className={`
            h-8 px-3 py-1 text-xs font-medium rounded-none border-0
            transition-all duration-200
            ${language === "en" ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}
          `}
        >
          EN
        </Button>
      </div>
    </div>
  )
}
