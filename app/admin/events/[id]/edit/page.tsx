"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Calendar, Check, AlertCircle, Eye, EyeOff, Upload, X, ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEvents, EventItem } from '@/contexts/EventsContext'
import SuccessToast from '@/components/ui/SuccessToast'

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const { getEventById, updateEvent } = useEvents()
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [event, setEvent] = useState<EventItem | null>(null)
  const [showLivePreview, setShowLivePreview] = useState(true)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    date: '',
    time: '09:00',
    location: '',
    locationEn: '',
    maxParticipants: '',
    registrationDeadline: '',
    eventType: 'conference',
    gradient: 'from-blue-500 to-cyan-500',
    status: 'upcoming',
    image: ''
  })

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 5000)
  }

  // Load event data
  useEffect(() => {
    const eventId = parseInt(params.id as string)
    if (eventId) {
      const foundEvent = getEventById(eventId)
      
      if (foundEvent) {
        setEvent(foundEvent)
        setFormData({
          title: foundEvent.title || '',
          titleEn: foundEvent.titleEn || '',
          description: foundEvent.description || '',
          descriptionEn: foundEvent.descriptionEn || '',
          date: foundEvent.date || '',
          time: foundEvent.time || '09:00',
          location: foundEvent.location || '',
          locationEn: foundEvent.locationEn || '',
          maxParticipants: foundEvent.participants?.replace(/\D/g, '') || '',
          registrationDeadline: '',
          eventType: foundEvent.category === 'Hội thảo' ? 'conference' :
                    foundEvent.category === 'Đào tạo' ? 'workshop' :
                    foundEvent.category === 'Triển lãm' ? 'exhibition' :
                    foundEvent.category === 'Training' ? 'training' :
                    foundEvent.category === 'Conference' ? 'conference' : 'conference',
          gradient: foundEvent.gradient || 'from-blue-500 to-cyan-500',
          status: foundEvent.status || 'upcoming',
          image: foundEvent.image || ''
        })
        setImagePreview(foundEvent.image || '')
      } else {
        // Handle not found case
        setToastMessage('Không tìm thấy sự kiện')
        setToastType('error')
        setShowToast(true)
        setTimeout(() => {
          router.push('/admin/events')
        }, 2000)
      }
    }
  }, [params.id, getEventById, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({
          ...prev,
          image: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview('')
    setFormData(prev => ({
      ...prev,
      image: ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      showNotification('❌ Vui lòng điền đầy đủ thông tin bắt buộc (tiêu đề, mô tả, ngày, địa điểm)', 'error')
      return
    }

    setIsLoading(true)
    
    try {
      const eventId = parseInt(params.id as string)
      const eventData = {
        title: formData.title,
        titleEn: formData.titleEn,
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        locationEn: formData.locationEn,
        participants: formData.maxParticipants ? `${formData.maxParticipants}+ người tham gia` : '50+ người tham gia',
        participantsEn: formData.maxParticipants ? `${formData.maxParticipants}+ participants` : '50+ participants',
        status: formData.status as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
        gradient: formData.gradient,
        image: formData.image || '/placeholder.svg',
        category: formData.eventType === 'conference' ? 'Hội thảo' :
                 formData.eventType === 'workshop' ? 'Đào tạo' :
                 formData.eventType === 'exhibition' ? 'Triển lãm' :
                 formData.eventType === 'training' ? 'Đào tạo' : 'Seminar',
        categoryEn: formData.eventType === 'conference' ? 'Conference' :
                   formData.eventType === 'workshop' ? 'Workshop' :
                   formData.eventType === 'exhibition' ? 'Exhibition' :
                   formData.eventType === 'training' ? 'Training' : 'Seminar'
      }

      updateEvent(eventId, eventData)
      setShowSuccessToast(true)
      
      // Redirect to events list after a delay
      setTimeout(() => {
        router.push('/admin/events')
      }, 2000)
      
    } catch (error) {
      console.error('Error updating event:', error)
      showNotification('❌ Có lỗi xảy ra khi cập nhật sự kiện', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin sự kiện...</p>
        </div>
      </div>
    )
  }

  const LivePreview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Preview</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLivePreview(!showLivePreview)}
          >
            {showLivePreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      {showLivePreview && (
        <CardContent>
          <div className={`bg-gradient-to-r ${formData.gradient} p-6 rounded-lg text-white`}>
            <div className="text-xs uppercase tracking-wider opacity-90 mb-2">
              {formData.eventType === 'conference' ? 'Hội thảo' :
               formData.eventType === 'workshop' ? 'Workshop' :
               formData.eventType === 'exhibition' ? 'Triển lãm' :
               formData.eventType === 'training' ? 'Đào tạo' : 'Seminar'}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {formData.title || 'Tiêu đề sự kiện'}
            </h3>
            <p className="opacity-90 text-sm mb-3">
              {formData.description || 'Mô tả sự kiện sẽ hiển thị ở đây...'}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formData.date || 'Chưa có ngày'} - {formData.time || '09:00'}
              </div>
              <div>📍 {formData.location || 'Chưa có địa điểm'}</div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      <SuccessToast 
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        message="Sự kiện đã được cập nhật thành công!"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa sự kiện</h1>
            <p className="text-gray-600">Cập nhật thông tin sự kiện</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/events">
              Hủy
            </Link>
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            form="event-form"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật sự kiện'}
          </Button>
        </div>
      </div>

      <form id="event-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tên sự kiện (Tiếng Việt) *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tên sự kiện"
                  required
                />
              </div>

              <div>
                <Label htmlFor="titleEn">Tên sự kiện (English)</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => handleInputChange('titleEn', e.target.value)}
                  placeholder="Enter event name in English"
                />
              </div>

              <div>
                <Label htmlFor="eventType">Loại sự kiện</Label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="conference">Hội thảo</option>
                  <option value="workshop">Workshop</option>
                  <option value="exhibition">Triển lãm</option>
                  <option value="training">Đào tạo</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Mô tả sự kiện (Tiếng Việt) *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Nhập mô tả chi tiết về sự kiện"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="descriptionEn">Mô tả sự kiện (English)</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                  placeholder="Enter event description in English"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="completed">Đã kết thúc</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <Label>Hình ảnh sự kiện</Label>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative">
                      <div className="relative w-full h-48 rounded-lg border border-gray-300 overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Event preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Nhấp để tải lên hình ảnh</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('imageUpload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Chọn hình ảnh
                      </Button>
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết sự kiện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Ngày tổ chức *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Giờ bắt đầu</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Địa điểm (Tiếng Việt) *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Nhập địa điểm tổ chức sự kiện"
                  required
                />
              </div>

              <div>
                <Label htmlFor="locationEn">Địa điểm (English)</Label>
                <Input
                  id="locationEn"
                  value={formData.locationEn}
                  onChange={(e) => handleInputChange('locationEn', e.target.value)}
                  placeholder="Enter event location in English"
                />
              </div>

              <div>
                <Label htmlFor="maxParticipants">Số lượng tham gia tối đa</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                  placeholder="Ví dụ: 300"
                />
              </div>

              <div>
                <Label>Màu chủ đề</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { value: 'from-blue-500 to-cyan-500', label: 'Xanh dương', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
                    { value: 'from-green-500 to-emerald-500', label: 'Xanh lá', preview: 'bg-gradient-to-r from-green-500 to-emerald-500' },
                    { value: 'from-purple-500 to-pink-500', label: 'Tím hồng', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
                    { value: 'from-amber-500 to-orange-500', label: 'Cam vàng', preview: 'bg-gradient-to-r from-amber-500 to-orange-500' },
                    { value: 'from-red-500 to-rose-500', label: 'Đỏ', preview: 'bg-gradient-to-r from-red-500 to-rose-500' },
                    { value: 'from-indigo-500 to-blue-500', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-blue-500' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('gradient', option.value)}
                      className={`
                        p-2 rounded-lg border-2 transition-all duration-200
                        ${formData.gradient === option.value 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`h-4 w-full rounded ${option.preview} mb-1`}></div>
                      <p className="text-xs text-gray-600">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <div className="lg:col-span-2">
            <LivePreview />
          </div>
        </div>
      </form>
    </div>
  )
} 