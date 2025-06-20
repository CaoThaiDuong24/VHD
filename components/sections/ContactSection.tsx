"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Mail, Phone, Clock, Navigation, Send } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ContactSection() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="text-xl lg:text-2xl font-display text-gray-900 mb-8">
              <span className="whitespace-nowrap">{t("contact.info.title")}</span>
            </h3>

            <div className="space-y-4">
              {[
                {
                  icon: MapPin,
                  title: t("contact.address.title"),
                  content: t("contact.address.content"),
                  color: "primary",
                },
                {
                  icon: Mail,
                  title: t("contact.email.title"),
                  content: "vanphong1@trungtamvanhoadoc.org.vn",
                  color: "blue",
                },
                {
                  icon: Phone,
                  title: t("contact.phone.title"),
                  content: "0912 116 668 (Văn phòng Trung tâm)",
                  color: "emerald",
                },
                {
                  icon: Clock,
                  title: t("contact.hours.title"),
                  content: t("contact.hours.content"),
                  color: "amber",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div
                    className={`w-10 h-10 bg-${item.color === "primary" ? "primary" : item.color === "blue" ? "blue-100" : item.color === "emerald" ? "emerald-100" : "amber-100"} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${item.color === "primary" ? "text-white" : item.color === "blue" ? "text-blue-600" : item.color === "emerald" ? "text-emerald-600" : "text-amber-600"}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 mb-1 whitespace-nowrap">{item.title}</h4>
                                            <div className="text-gray-600 text-sm leading-relaxed break-words vietnamese-text vietnamese-wrap">
                          {item.content.includes('\n')
                            ? item.content.split('\n').map((line, lineIndex) => (
                                <div key={lineIndex} className="text-no-orphans preserve-phrases">{line}</div>
                              ))
                            : <div className="text-no-orphans preserve-phrases">{item.content}</div>
                          }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <h3 className="text-lg lg:text-xl font-display text-gray-900 mb-2">
                  <span className="whitespace-nowrap">{t("contact.form.title")}</span>
                </h3>
                <p className="text-sm lg:text-base text-gray-600 mb-6">{t("contact.form.description")}</p>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">
                      {t("contact.form.name")} *
                    </label>
                    <Input placeholder={t("contact.form.name.placeholder")} className="focus-ring border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">
                      {t("contact.form.phone")} *
                    </label>
                    <Input placeholder={t("contact.form.phone.placeholder")} className="focus-ring border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">
                      {t("contact.form.email")}
                    </label>
                    <Input placeholder={t("contact.form.email.placeholder")} className="focus-ring border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">
                      {t("contact.form.message")} *
                    </label>
                    <Textarea
                      placeholder={t("contact.form.message.placeholder")}
                      className="min-h-[100px] focus-ring border-gray-200 resize-none"
                    />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium shadow-soft hover:shadow-lg transition-all duration-200 text-sm lg:text-base">
                    <Send className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{t("contact.form.submit")}</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl lg:text-2xl font-display text-gray-900 mb-4">
              <span className="whitespace-nowrap">{t("contact.map.title")}</span>
            </h3>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">{t("contact.map.description")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-soft overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d466.35945202183267!2d105.8436388!3d21.0328411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abbddc08de1d%3A0x34734a82d8a27cbb!2s10%20P.%20%C4%90%C6%B0%E1%BB%9Dng%20Th%C3%A0nh%2C%20C%E1%BB%ADa%20%C4%90%C3%B4ng%2C%20Ho%C3%A0n%20Ki%E1%BA%BFm%2C%20H%C3%A0%20N%E1%BB%99i%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1705234567890!5m2!1svi!2s"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </Card>
            </div>

            {/* Directions */}
            <div className="space-y-4">
              <Card className="border-0 shadow-minimal">
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3 whitespace-nowrap">{t("contact.directions.title")}</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <div className="font-medium text-gray-900 whitespace-nowrap">{t("contact.directions.bus")}</div>
                      <div className="text-xs lg:text-sm">{t("contact.directions.bus.desc")}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 whitespace-nowrap">{t("contact.directions.car")}</div>
                      <div className="text-xs lg:text-sm">{t("contact.directions.car.desc")}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 whitespace-nowrap">{t("contact.directions.taxi")}</div>
                      <div className="text-xs lg:text-sm">{t("contact.directions.taxi.desc")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-minimal">
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3 whitespace-nowrap">{t("contact.nearby.title")}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs lg:text-sm truncate flex-1 mr-2">
                        {t("contact.nearby.hoankiem")}
                      </span>
                      <span className="text-primary font-medium whitespace-nowrap">200m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs lg:text-sm truncate flex-1 mr-2">
                        {t("contact.nearby.cathedral")}
                      </span>
                      <span className="text-primary font-medium whitespace-nowrap">500m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs lg:text-sm truncate flex-1 mr-2">
                        {t("contact.nearby.oldquarter")}
                      </span>
                      <span className="text-primary font-medium whitespace-nowrap">300m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-xs lg:text-sm"
                onClick={() => {
                  const address = "Tầng 3, Nhà A, Số 10 Đường Thành, Phường Cửa Đông, Quận Hoàn Kiếm, Hà Nội";
                  const encodedAddress = encodeURIComponent(address);
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
                }}
              >
                <Navigation className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap truncate">{t("contact.directions.btn")}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
