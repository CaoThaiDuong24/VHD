"use client"

import { useState } from "react"
import { X, User, Mail, Phone, MapPin, Calendar, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/LanguageContext"

interface EventRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  eventTitle: string
  eventDate: string
  eventLocation: string
}

export default function EventRegistrationModal({
  isOpen,
  onClose,
  eventTitle,
  eventDate,
  eventLocation
}: EventRegistrationModalProps) {
  const { language } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    experience: "",
    expectations: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1000)
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
      experience: "",
      expectations: ""
    })
    setIsSubmitted(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-emerald-500 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {language === 'vi' ? 'Đăng ký tham gia sự kiện' : 'Event Registration'}
                </h2>
                <p className="text-white/80 text-sm">
                  {language === 'vi' ? 'Vui lòng điền thông tin để đăng ký' : 'Please fill in your information to register'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!isSubmitted ? (
            <>
              {/* Event Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {language === 'vi' ? 'Thông tin sự kiện' : 'Event Information'}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-medium">{eventTitle}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    <span>{eventDate}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span>{eventLocation}</span>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    {language === 'vi' ? 'Thông tin cá nhân' : 'Personal Information'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'vi' ? 'Họ và tên' : 'Full Name'} *
                      </label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={language === 'vi' ? 'Nhập họ và tên' : 'Enter full name'}
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
                        placeholder={language === 'vi' ? 'Nhập địa chỉ email' : 'Enter email address'}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'vi' ? 'Số điện thoại' : 'Phone Number'} *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={language === 'vi' ? 'Nhập số điện thoại' : 'Enter phone number'}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'vi' ? 'Tổ chức/Công ty' : 'Organization/Company'}
                      </label>
                      <Input
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        placeholder={language === 'vi' ? 'Nhập tên tổ chức' : 'Enter organization name'}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    {language === 'vi' ? 'Thông tin nghề nghiệp' : 'Professional Information'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'vi' ? 'Chức vụ/Vị trí' : 'Position/Title'}
                      </label>
                      <Input
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder={language === 'vi' ? 'Nhập chức vụ hiện tại' : 'Enter current position'}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'vi' ? 'Kinh nghiệm liên quan' : 'Relevant Experience'}
                      </label>
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder={language === 'vi' ? 'Mô tả ngắn gọn kinh nghiệm của bạn...' : 'Briefly describe your experience...'}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'vi' ? 'Mong muốn từ sự kiện' : 'Expectations from Event'}
                      </label>
                      <textarea
                        name="expectations"
                        value={formData.expectations}
                        onChange={handleInputChange}
                        placeholder={language === 'vi' ? 'Bạn mong muốn gì từ sự kiện này?' : 'What do you expect from this event?'}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      {language === 'vi' 
                        ? 'Tôi đồng ý với các điều khoản và điều kiện của sự kiện. Tôi hiểu rằng thông tin cá nhân sẽ được sử dụng để liên lạc về sự kiện này.'
                        : 'I agree to the terms and conditions of the event. I understand that personal information will be used to communicate about this event.'
                      }
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 py-3"
                  >
                    {language === 'vi' ? 'Hủy' : 'Cancel'}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 py-3"
                  >
                    {language === 'vi' ? 'Đăng ký ngay' : 'Register Now'}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            /* Success Message */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'vi' ? 'Đăng ký thành công!' : 'Registration Successful!'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {language === 'vi' 
                  ? 'Cảm ơn bạn đã đăng ký tham gia sự kiện. Chúng tôi sẽ gửi email xác nhận và thông tin chi tiết trong thời gian sớm nhất.'
                  : 'Thank you for registering for the event. We will send you a confirmation email and detailed information soon.'
                }
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleClose}
                  className="w-full bg-primary hover:bg-primary/90 py-3"
                >
                  {language === 'vi' ? 'Đóng' : 'Close'}
                </Button>
                <p className="text-sm text-gray-500">
                  {language === 'vi' 
                    ? 'Kiểm tra email để xem thông tin chi tiết'
                    : 'Check your email for detailed information'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
