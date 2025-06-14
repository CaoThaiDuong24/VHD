"use client"

import { MapPin, Mail, Phone, Facebook, MessageCircle, Globe, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"


export default function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Image src="/images/rcp-logo.png" alt="RCP Logo" width={24} height={24} className="object-contain" />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-display whitespace-nowrap">RCP</span>
                <div className="text-xs text-gray-400 whitespace-nowrap">Reading Culture Center</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">{t("footer.brand")}</p>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-medium text-white text-sm whitespace-nowrap">{t("footer.connect")}</h4>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90 p-2 rounded-lg">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 p-2 rounded-lg">
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-medium mb-4 text-white whitespace-nowrap">{t("footer.quicklinks")}</h3>
            <ul className="space-y-2">
              {[
                t("footer.quicklinks.about"),
                t("footer.quicklinks.news"),
                t("footer.quicklinks.programs"),
                t("footer.quicklinks.support"),
                t("footer.quicklinks.partners"),
                t("footer.quicklinks.careers"),
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm leading-relaxed block truncate"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization Info */}
          <div className="md:col-span-1">
            <h3 className="font-medium mb-4 text-white whitespace-nowrap">{t("footer.orginfo")}</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div>
                <div className="font-medium text-white mb-1 whitespace-nowrap">{t("footer.orginfo.fullname")}</div>
                <div className="text-xs lg:text-sm leading-relaxed">{t("footer.orginfo.fullname.value")}</div>
              </div>
              <div>
                <div className="font-medium text-white mb-1 whitespace-nowrap">{t("footer.orginfo.english")}</div>
                <div className="text-xs lg:text-sm leading-relaxed">{t("footer.orginfo.english.value")}</div>
              </div>
              <div>
                <div className="font-medium text-white mb-1 whitespace-nowrap">{t("footer.orginfo.established")}</div>
                <div className="whitespace-nowrap">{t("footer.orginfo.established.value")}</div>
              </div>
              <div>
                <div className="font-medium text-white mb-1 whitespace-nowrap">{t("footer.orginfo.parent")}</div>
                <div className="text-xs lg:text-sm">{t("footer.orginfo.parent.value")}</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="font-medium mb-4 text-white whitespace-nowrap">{t("footer.contact")}</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-gray-300 text-sm break-words">{t("contact.address.content")}</div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="text-gray-300 text-sm break-all min-w-0">vanphong1@trungtamvanhoadoc.org.vn</div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="text-gray-300 text-sm whitespace-nowrap">0912 116 668 (Ms. Yến Nhi)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-gray-400 text-center md:text-left text-sm">
              <p>&copy; {t("footer.copyright")}</p>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-200 whitespace-nowrap">
                {t("footer.privacy")}
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200 whitespace-nowrap">
                {t("footer.terms")}
              </a>
              <button 
                className="flex items-center hover:text-white transition-colors duration-200 whitespace-nowrap"
                onClick={() => {}}
              >
                <Map className="h-3 w-3 mr-1" />
                {language === 'vi' ? 'Sơ đồ trang web' : 'Sitemap'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
