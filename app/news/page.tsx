"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useNews } from "@/contexts/NewsContext"
import { ChevronLeft, ChevronRight, Calendar, Newspaper, BarChart3, Filter, Search, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import ModernHeader from "@/components/layout/ModernHeader"
import Footer from "@/components/layout/Footer"
import NewsCard from "@/components/ui/NewsCard"

export default function NewsPage() {
  const { language } = useLanguage()
  const { newsItems } = useNews()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const itemsPerPage = 4
  
  // Get unique categories
  const categories = useMemo(() => {
    const cats = newsItems.map(item => item.category)
    return [...new Set(cats)]
  }, [newsItems])

  // Filter news based on search term and category
  const filteredNews = useMemo(() => {
    return newsItems
      .filter(item => {
        const matchesSearch = searchTerm === "" || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesCategory = selectedCategory === "" || item.category === selectedCategory
        
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => b.id - a.id) // Sort by ID descending (newest first)
  }, [newsItems, searchTerm, selectedCategory])

  // Reset current page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setCurrentPage(1)
  }

  // Active filters count
  const activeFiltersCount = (searchTerm ? 1 : 0) + (selectedCategory ? 1 : 0)

  return (
    <div className="min-h-screen">
      <ModernHeader />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                <Newspaper className="w-4 h-4 mr-2" />
                {language === 'vi' ? 'Tin tức & Sự kiện' : 'News & Events'}
              </div>
              <h1 className="font-display mb-6">
                {/* Main Title */}
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight mb-2 lg:mb-4">
                  <span className="block">
                    {language === 'vi' ? 'Khám phá những' : 'Discover the'}
                  </span>
                </div>

                {/* Highlight */}
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-2 lg:mb-4">
                  <span className="gradient-text-primary font-bold">
                    {language === 'vi' ? 'Tin tức mới nhất' : 'Latest News'}
                  </span>
                </div>

                {/* Sub Title */}
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-gray-800 leading-tight">
                  <span className="block">
                    {language === 'vi' ? 'Văn hóa đọc' : 'Reading Culture'}
                  </span>
                </div>
              </h1>

              {/* Elegant Divider */}
              <div className="flex items-center justify-center mt-6 lg:mt-8 mb-6">
                <div className="w-16 lg:w-20 h-1 bg-gradient-to-r from-primary to-emerald-500 rounded-full"></div>
                <div className="w-3 h-3 bg-primary rounded-full mx-4 animate-pulse"></div>
                <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {language === 'vi' 
                  ? 'Cập nhật những thông tin mới nhất về hoạt động phát triển văn hóa đọc, sự kiện và chương trình của trung tâm'
                  : 'Stay updated with the latest information about reading culture development activities, events and center programs'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Main Content - Two Column Layout */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column - News Cards */}
              <div className="flex-1 lg:w-2/3">
                {paginatedNews.length > 0 ? (
                  <>
                    {/* News Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {paginatedNews.map((news, index) => (
                        <div key={news.id} className="transform hover:scale-[1.02] transition-transform duration-200">
                          <NewsCard item={news} />
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="rounded-lg"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex space-x-1">
                          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let page;
                            if (totalPages <= 5) {
                              page = i + 1;
                            } else if (currentPage <= 3) {
                              page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              page = totalPages - 4 + i;
                            } else {
                              page = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-10 h-10 rounded-lg"
                              >
                                {page}
                              </Button>
                            );
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="rounded-lg"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  /* No Results */
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Newspaper className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {language === 'vi' ? 'Không tìm thấy tin tức' : 'No news found'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === 'vi' 
                        ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                        : 'Try changing your search terms or filters'
                      }
                    </p>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="rounded-lg"
                      >
                        {language === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column - Search & Filter Sidebar */}
              <div className="lg:w-1/3">
                <div className="sticky top-24">
                  {/* Search & Filter Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Search className="w-5 h-5 mr-2 text-primary" />
                      {language === 'vi' ? 'Tìm kiếm & Lọc' : 'Search & Filter'}
                    </h3>
                    
                    {/* Search Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'vi' ? 'Từ khóa' : 'Keywords'}
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder={language === 'vi' ? 'Nhập từ khóa...' : 'Enter keywords...'}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 rounded-lg border-gray-200 focus:border-primary focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'vi' ? 'Danh mục' : 'Category'}
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <Filter className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700 text-sm truncate">
                              {selectedCategory || (language === 'vi' ? 'Tất cả danh mục' : 'All categories')}
                            </span>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setSelectedCategory("")
                                  setIsDropdownOpen(false)
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-700"
                              >
                                {language === 'vi' ? 'Tất cả danh mục' : 'All categories'}
                              </button>
                              {categories.map((category) => (
                                <button
                                  key={category}
                                  onClick={() => {
                                    setSelectedCategory(category)
                                    setIsDropdownOpen(false)
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="w-full rounded-lg border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {language === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
                      </Button>
                    )}
                  </div>

                  {/* Results Summary */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                      {language === 'vi' ? 'Kết quả' : 'Results'}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {language === 'vi' ? 'Tổng số bài viết:' : 'Total articles:'}
                        </span>
                        <span className="font-semibold text-primary">{filteredNews.length}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {language === 'vi' ? 'Trang hiện tại:' : 'Current page:'}
                        </span>
                        <span className="font-semibold text-gray-900">{currentPage} / {totalPages || 1}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {language === 'vi' ? 'Danh mục:' : 'Categories:'}
                        </span>
                        <span className="font-semibold text-gray-900">{categories.length}</span>
                      </div>
                    </div>

                    {/* Active Filters */}
                    {activeFiltersCount > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-600 mb-2">
                          {language === 'vi' ? 'Bộ lọc đang áp dụng:' : 'Active filters:'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {searchTerm && (
                            <Badge className="bg-primary/10 text-primary border-0 px-2 py-1 rounded-md text-xs">
                              "{searchTerm}"
                              <button
                                onClick={() => setSearchTerm("")}
                                className="ml-1 hover:text-primary/70"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          )}
                          {selectedCategory && (
                            <Badge className="bg-primary/10 text-primary border-0 px-2 py-1 rounded-md text-xs">
                              {selectedCategory}
                              <button
                                onClick={() => setSelectedCategory("")}
                                className="ml-1 hover:text-primary/70"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-emerald-50 rounded-2xl border border-primary/20 p-6 shadow-lg">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500 rounded-full translate-y-12 -translate-x-12"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                          <BarChart3 className="w-4 h-4 text-primary" />
                        </div>
                        {language === 'vi' ? 'Thống kê nhanh' : 'Quick Stats'}
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Total Articles */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Newspaper className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-700">
                                  {language === 'vi' ? 'Tổng bài viết' : 'Total Articles'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {language === 'vi' ? 'Tất cả tin tức' : 'All news'}
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-primary">{newsItems.length}</div>
                          </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Filter className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-700">
                                  {language === 'vi' ? 'Danh mục' : 'Categories'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {language === 'vi' ? 'Phân loại tin' : 'News types'}
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-emerald-600">{categories.length}</div>
                          </div>
                        </div>

                        {/* Current Page Info */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-amber-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-700">
                                  {language === 'vi' ? 'Trang hiện tại' : 'Current Page'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {language === 'vi' ? 'Vị trí hiện tại' : 'Current position'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-amber-600">{currentPage}</div>
                              <div className="text-xs text-gray-500">/ {totalPages || 1}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 