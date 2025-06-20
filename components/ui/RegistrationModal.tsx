"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/LanguageContext"
import { 
  X, 
  User, 
  Building, 
  CheckCircle,
  Send,
  CalendarDays
} from "lucide-react"

type RegistrationModalProps = {
  isOpen: boolean
  onClose: () => void
  eventTitle?: string
}

export default function RegistrationModal({ isOpen, onClose, eventTitle }: RegistrationModalProps) {
  const { language, t } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    message: '',
    agreeToTerms: false
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false)
        onClose()
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          organization: '',
          position: '',
          message: '',
          agreeToTerms: false
        })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSubmitted, onClose])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary to-emerald-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {t("event.registration.title")}
                </h2>
                <p className="text-primary-100 text-sm">
                  {eventTitle || t("event.registration.subtitle")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          {isSubmitted ? (
            // Success Screen
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("event.registration.success.title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("event.registration.success.message")}
              </p>
              <div className="text-sm text-gray-500">
                {t("contact.modal.closing")}
              </div>
            </div>
          ) : (
            // Registration Form
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  {t("contact.modal.personal.info")}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("contact.modal.full.name")} *
                    </label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder={t("contact.modal.placeholder.name")}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t("contact.modal.placeholder.email")}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("contact.modal.phone")}
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t("contact.modal.placeholder.phone")}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("contact.modal.organization")}
                    </label>
                    <Input
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder={t("contact.modal.placeholder.organization")}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-primary" />
                  {t("contact.modal.professional.info")}
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.modal.position")}
                  </label>
                  <Input
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder={t("contact.modal.placeholder.position")}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.modal.message")}
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t("contact.modal.placeholder.message")}
                    rows={4}
                    className="w-full resize-none"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  required
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed">
                  {t("contact.modal.agree.terms.events")}
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="px-6"
                >
                  {t("contact.modal.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.agreeToTerms}
                  className="px-6 bg-primary hover:bg-primary/90 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t("event.registration.registering")}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="w-4 h-4 mr-2" />
                      {t("event.registration.register.now")}
                    </div>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 