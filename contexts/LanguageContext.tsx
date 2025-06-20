"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "vi" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  vi: {
    // Header
    "nav.home": "Trang chủ",
    "nav.about": "Về chúng tôi",
    "nav.news": "Tin tức",
    "nav.events": "Sự kiện",
    "nav.projects": "Dự án",
    "nav.contact": "Liên hệ",
    "header.cta": "Liên hệ ngay",
    "header.cta.mobile": "Liên hệ với chúng tôi",
    "header.language": "Ngôn ngữ",
    "header.brand.subtitle": "Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản",

    // Hero Section
    "hero.subtitle": "Đơn vị trực thuộc Hội Xuất Bản Việt Nam",
    "hero.title.main": "TRUNG TÂM PHÁT TRIỂN VĂN HÓA ĐỌC",
    "hero.title.highlight": "VĂN HÓA ĐỌC",
    "hero.title.sub": "VÀ KINH TẾ XUẤT BẢN",
    "hero.description": "Kết nối tri thức – Lan tỏa văn hóa đọc\nĐồng hành cùng sự phát triển ngành xuất bản Việt Nam",
    "hero.btn.learn": "Tìm hiểu thêm",
    "hero.btn.contact": "Liên hệ với chúng tôi",
    "hero.established": "Thành lập",
    "hero.trust.reputation": "Uy tín hàng đầu",
    "hero.trust.readers": "50K+ độc giả",
    "hero.trust.growth": "Tăng trưởng bền vững",
    "hero.image.alt": "Hoạt động nghiên cứu và phát triển văn hóa đọc - Trung tâm phát triển văn hóa đọc và kinh tế xuất bản",

    // Stats Section
    "stats.title": "Thành tựu của chúng tôi",
    "stats.subtitle": "Những con số ấn tượng thể hiện cam kết của RCP trong việc phát triển văn hóa đọc",
    "stats.programs": "Chương trình",
    "stats.programs.desc": "Chương trình văn hóa đọc",
    "stats.readers": "Độc giả",
    "stats.readers.desc": "Độc giả tham gia",
    "stats.support": "Hỗ trợ",
    "stats.support.desc": "Hỗ trợ liên tục",
    "stats.partners": "Đối tác",
    "stats.partners.desc": "Đối tác chiến lược",
    "stats.bottom.message": "Cùng nhau xây dựng văn hóa đọc Việt Nam",
    "stats.outstanding": "Thành tựu nổi bật",
    "stats.future.vietnam": "Cùng nhau kiến tạo tương lai tri thức Việt Nam",

    // About Section
    "about.badge": "Về chúng tôi",
    "about.title": "Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản",
    "about.description1":
      "Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản (Center for Developing Reading Culture and Publishing Economy - RCP) là đơn vị trực thuộc Hội Xuất bản Việt Nam.\n\nTrung tâm được thành lập với sứ mệnh tham mưu và triển khai các chương trình, hoạt động hỗ trợ phát triển văn hóa đọc, đồng thời thúc đẩy sự phát triển của nền kinh tế xuất bản quốc gia.",
    "about.description2":
      'Với tôn chỉ hoạt động: "Kết nối tri thức – Lan tỏa văn hóa đọc\nĐồng hành cùng sự phát triển ngành xuất bản Việt Nam", Trung tâm hướng tới việc xây dựng và lan tỏa thói quen đọc sách trong cộng đồng.',
    "about.established": "Thành lập",
    "about.established.date": "01/04/2024",
    "about.management": "Chủ quản",
    "about.management.org": "Hội Xuất bản VN",
    "about.mission1.title": "Kết nối tri thức",
    "about.mission1.desc": "Xây dựng cầu nối giữa tri thức và cộng đồng, tạo môi trường học tập bền vững",
    "about.mission2.title": "Lan tỏa văn hóa đọc",
    "about.mission2.desc": "Phát triển thói quen đọc sách, nâng cao nhận thức về giá trị của tri thức",
    "about.mission3.title": "Đồng hành phát triển",
    "about.mission3.desc": "Hỗ trợ ngành xuất bản Việt Nam phát triển bền vững và hiệu quả",
    "about.pioneer.unit": "Đơn vị tiên phong trong việc phát triển văn hóa đọc và thúc đẩy nền kinh tế xuất bản Việt Nam",
    "about.image1.title": "Không gian đọc hiện đại",
    "about.image1.desc": "Môi trường học tập thoải mái và chuyên nghiệp",
    "about.image1.alt": "Không gian đọc hiện đại với thanh niên đang đọc sách",
    "about.image2.title": "Phát triển văn hóa đọc",
    "about.image2.desc": "Lan tỏa văn hóa đọc trong cộng đồng",
    "about.image2.alt": "Phát triển văn hóa đọc trong cộng đồng",

    // Vision Mission Section
    "vision.badge": "Định hướng phát triển",
    "vision.title": "Tầm nhìn - Sứ mệnh - Giá trị cốt lõi",
    "vision.vision.title": "Tầm nhìn",
    "vision.vision.content":
      "Trung tâm Phát triển Văn hóa Đọc và Kinh tế Xuất bản phấn đấu trở thành một đơn vị tiên phong trong việc thúc đẩy văn hóa đọc và phát triển bền vững ngành xuất bản Việt Nam.\n\nTrung tâm đóng vai trò cầu nối giữa độc giả, các nhà xuất bản, các đơn vị kinh doanh sách và cơ quan quản lý Nhà nước.",
    "vision.mission.title": "Sứ mệnh",
    "vision.mission.content":
      "Trung tâm hướng tới xây dựng một xã hội học tập, nơi mỗi người dân đều có điều kiện tiếp cận tri thức một cách công bằng, thuận tiện.\n\nTừ đó lan tỏa tinh thần hiếu học, nâng cao dân trí, phát triển nguồn nhân lực tri thức và đóng góp tích cực vào sự phát triển kinh tế - văn hóa - xã hội của đất nước.",
    "vision.values.title": "Giá trị cốt lõi",
    "vision.value1.title": "Trí tuệ - Sáng tạo\nPhụng sự cộng đồng",
    "vision.value1.desc": "Phát huy trí tuệ tập thể, khuyến khích sáng tạo và luôn đặt lợi ích cộng đồng lên hàng đầu",
    "vision.value2.title": "Kết nối - Chia sẻ\nPhát triển bền vững",
    "vision.value2.desc": "Xây dựng mạng lưới kết nối mạnh mẽ, chia sẻ tri thức và hướng tới phát triển bền vững",
    "vision.value3.title": "Chính trực - Trách nhiệm\nTôn trọng tri thức",
    "vision.value3.desc": "Hoạt động với tinh thần chính trực, có trách nhiệm cao và luôn tôn trọng giá trị tri thức",
    "vision.quote": "Tri thức là sức mạnh, văn hóa đọc là nền tảng của một dân tộc văn minh",
    "vision.future.knowledge": "Hướng tới tương lai tri thức Việt Nam",
    "vision.pioneer.technology": "Tiên phong trong công nghệ xuất bản",
    "mission.spread.culture": "Lan tỏa văn hóa đọc trong cộng đồng",
    "mission.develop.human": "Phát triển nguồn nhân lực tri thức",
    "values.rcp.core": "Giá trị cốt lõi của RCP",
    "values.work.culture": "Xây dựng văn hóa làm việc chuyên nghiệp và hiệu quả",

    // Director Message
    "director.badge": "Thông điệp lãnh đạo",
    "director.title": "Lời nhắn gửi từ Ban Giám đốc",
    "director.quote":
      "Khi một đứa trẻ yêu sách, là một hạt giống tri thức được gieo trồng. Khi cả cộng đồng yêu sách, là một tương lai bền vững đang được vun đắp.\n\nPhát triển văn hóa đọc là hành trình bền bỉ và lâu dài. Chúng tôi hạnh phúc khi được góp phần vào hành trình đẹp đẽ ấy của cộng đồng.",
    "director.name": "Ông Nguyễn Thanh Hân",
    "director.position": "Giám đốc Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản",

    // Partners Section
    "partners.badge": "Hợp tác & Liên kết",
    "partners.title": "Đơn vị đồng hành",
    "partners.description": "Cùng chúng tôi xây dựng một cộng đồng đọc mạnh mẽ và phát triển ngành xuất bản Việt Nam",
    "partners.btn": "Trở thành đối tác",
    "partners.list.youth_union": "Đoàn Thanh niên\nCộng sản Hồ Chí Minh",
    "partners.list.thanh_nien": "Báo Thanh Niên\nViệt Nam",
    "partners.list.tri_thuc": "Tạp chí\nTri thức",
    "partners.list.ysw": "YSW - Tổ chức\nCông tác xã hội trẻ",
    "partners.list.kim_dong": "Nhà xuất bản\nKim Đồng",
    "partners.list.huong_trang": "Công ty Sách\nHương Trang",
    "partners.list.expert_club": "Câu lạc bộ\nChuyến xe Yêu thương",

    // Partners Categories
    "partners.category.youth": "Tổ chức thanh niên",
    "partners.category.media": "Báo chí",
    "partners.category.magazine": "Tạp chí",
    "partners.category.social": "Tổ chức xã hội",
    "partners.category.publisher": "Nhà xuất bản",
    "partners.category.bookstore": "Nhà sách",
    "partners.category.club": "Câu lạc bộ",

    // Partners Stats
    "partners.stats.partners": "Đối tác",
    "partners.stats.projects": "Dự án chung",
    "partners.stats.years": "Năm hợp tác",

    // News Section
    "news.badge": "Cập nhật mới nhất",
    "news.title": "Tin tức & Sự kiện",
    "news.readmore": "Đọc thêm →",
    "news.description":
      "Khám phá những hoạt động mới nhất trong việc thúc đẩy văn hóa đọc và phát triển ngành xuất bản",
    "news.cta.description": "Theo dõi thêm nhiều tin tức và sự kiện thú vị từ RCP",
    "news.cta.button": "Xem tất cả tin tức",
    "news.item1.title": "Hội thảo Phát triển văn hóa đọc trong cộng đồng",
    "news.item2.title": "Chương trình tặng sách cho trẻ em vùng cao",
    "news.item3.title": "Triển lãm sách và văn hóa đọc 2024",
    "news.item4.title": "Đào tạo kỹ năng xuất bản cho doanh nghiệp",
    "news.item5.title": "Kết nối các nhà xuất bản Đông Nam Á",
    "news.item6.title": "Nghiên cứu xu hướng đọc của giới trẻ",
    "news.discover.activities":
      "Khám phá những hoạt động mới nhất trong việc thúc đẩy văn hóa đọc và phát triển ngành xuất bản",
    "news.subscribe.info": "Đăng ký nhận thông tin để không bỏ lỡ những tin tức và sự kiện quan trọng từ RCP",
    "news.new.badge": "Mới",

    // Contact Section
    "contact.badge": "Liên hệ với chúng tôi",
    "contact.hero.title": "Kết nối với",
    "contact.hero.highlight": "RCP",
    "contact.hero.description":
      "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong hành trình phát triển văn hóa đọc",
    "contact.info.title": "Thông tin liên hệ",
    "contact.address.title": "Địa chỉ trụ sở",
    "contact.address.content": "Tầng 3, Nhà A, Số 10 Đường Thành,\nPhường Cửa Đông, Quận Hoàn Kiếm, Hà Nội",
    "contact.email.title": "Email",
    "contact.phone.title": "Điện thoại",
    "contact.hours.title": "Giờ làm việc",
    "contact.hours.content": "Thứ 2 - Thứ 6: 8:00 - 17:00 | Thứ 7: 8:00 - 12:00",
    "contact.form.title": "Gửi tin nhắn",
    "contact.form.description": "Để lại thông tin và chúng tôi sẽ liên hệ với bạn sớm nhất có thể",
    "contact.form.name": "Họ và tên",
    "contact.form.name.placeholder": "Nhập họ tên của bạn",
    "contact.form.phone": "Số điện thoại",
    "contact.form.phone.placeholder": "Nhập số điện thoại",
    "contact.form.email": "Email",
    "contact.form.email.placeholder": "Nhập địa chỉ email",
    "contact.form.message": "Nội dung",
    "contact.form.message.placeholder": "Nhập nội dung cần trao đổi...",
    "contact.form.submit": "Gửi tin nhắn",
    "contact.map.badge": "Vị trí trên bản đồ",
    "contact.map.title": "Tìm đường đến RCP",
    "contact.map.description":
      "Chúng tôi tọa lạc tại trung tâm Hà Nội, thuận tiện cho việc di chuyển bằng mọi phương tiện",
    "contact.directions.title": "Hướng dẫn đi lại",
    "contact.directions.bus": "Xe buýt",
    "contact.directions.bus.desc": "Tuyến 09, 14, 18 - Dừng tại Hồ Gươm",
    "contact.directions.car": "Xe máy/Ô tô",
    "contact.directions.car.desc": "Có bãi đỗ xe trong tòa nhà",
    "contact.directions.taxi": "Taxi/Grab",
    "contact.directions.taxi.desc": "Dễ dàng gọi xe từ mọi nơi trong thành phố",
    "contact.nearby.title": "Địa điểm lân cận",
    "contact.nearby.hoankiem": "Hồ Hoàn Kiếm",
    "contact.nearby.cathedral": "Nhà thờ Lớn",
    "contact.nearby.oldquarter": "Phố cổ Hà Nội",
    "contact.nearby.postoffice": "Bưu điện Hà Nội",
    "contact.directions.btn": "Chỉ đường bằng Google Maps",



    // About Page
    "about.page.title": "Về chúng tôi",
    "about.page.hero.title": "Trung tâm Phát triển",
    "about.page.hero.highlight": "Văn hóa đọc",
    "about.page.hero.sub": "và Kinh tế Xuất bản",
    "about.page.hero.description":
      "Đơn vị trực thuộc Hội Xuất bản Việt Nam, tiên phong trong việc phát triển văn hóa đọc và thúc đẩy nền kinh tế xuất bản quốc gia",
    "about.page.intro.title": "Giới thiệu chung",
    "about.page.structure.title": "Cơ cấu tổ chức",
    "about.page.management": "Ban Giám đốc",
    "about.page.admin": "Phòng Hành chính",
    "about.page.programs": "Phòng Chương trình",
    "about.page.external": "Phòng Đối ngoại",
    "about.page.members": "thành viên",

    // Events Page
    "events.page.title": "Sự kiện & Hoạt động",
    "events.page.hero.title": "Sự kiện của",
    "events.page.hero.highlight": "RCP",
    "events.page.hero.description":
      "Tham gia các sự kiện, hội thảo và hoạt động của chúng tôi để cùng phát triển văn hóa đọc và ngành xuất bản Việt Nam",
    "events.upcoming.title": "Sự kiện sắp tới",
    "events.past.title": "Sự kiện đã diễn ra",
    "events.status.upcoming": "Sắp diễn ra",
    "events.status.completed": "Đã hoàn thành",
    "events.participants": "người tham gia",
    "events.participants.past": "người đã tham gia",
    "events.register": "Đăng ký tham gia",
    "events.report": "Xem báo cáo",

    // Events Data
    "events.upcoming.event1.title": "Hội thảo Phát triển văn hóa đọc trong cộng đồng 2025",
    "events.upcoming.event1.location": "Trung tâm Hội nghị Quốc gia, Hà Nội",
    "events.upcoming.event2.title": "Triển lãm sách và văn hóa đọc Việt Nam 2025",
    "events.upcoming.event2.location": "Trung tâm Triển lãm Giảng Võ, Hà Nội",
    "events.upcoming.event3.title": "Chương trình tặng sách cho trẻ em vùng cao",
    "events.upcoming.event3.location": "Tỉnh Lai Châu",
    "events.past.event1.title": "Đào tạo kỹ năng xuất bản cho doanh nghiệp",
    "events.past.event1.location": "Khách sạn Lotte, Hà Nội",
    "events.past.event2.title": "Kết nối các nhà xuất bản Đông Nam Á",
    "events.past.event2.location": "Trung tâm Hội nghị JW Marriott",
    "events.past.event3.title": "Nghiên cứu xu hướng đọc của giới trẻ",
    "events.past.event3.location": "Đại học Quốc gia Hà Nội",

    // Projects Page
    "projects.page.title": "Dự án & Chương trình",
    "projects.page.hero.title": "Dự án của",
    "projects.page.hero.highlight": "RCP",
    "projects.page.hero.description":
      "Khám phá các dự án và chương trình mà chúng tôi đang triển khai để phát triển văn hóa đọc và ngành xuất bản",
    "projects.ongoing.title": "Dự án đang triển khai",
    "projects.completed.title": "Dự án đã hoàn thành",
    "projects.status.ongoing": "Đang triển khai",
    "projects.status.completed": "Hoàn thành",
    "projects.progress": "Tiến độ",
    "projects.details": "Xem chi tiết",
    "projects.report": "Xem báo cáo",
    "projects.results.label": "Kết quả",
    "projects.stats.title": "Thống kê dự án",
    "projects.stats.completed": "Dự án hoàn thành",
    "projects.stats.ongoing": "Dự án đang triển khai",
    "projects.stats.beneficiaries": "Người thụ hưởng",
    "projects.stats.partners": "Đối tác",

    // Projects Data
    "projects.ongoing.project1.title": "Chương trình Thư viện Xanh Cộng đồng",
    "projects.ongoing.project1.description":
      "Xây dựng mạng lưới thư viện xanh tại các khu dân cư, trường học và cơ quan để thúc đẩy văn hóa đọc bền vững",
    "projects.ongoing.project1.participants": "50+ cộng đồng",
    "projects.ongoing.project1.budget": "2.5 tỷ VNĐ",
    "projects.ongoing.project2.title": "Nền tảng Xuất bản Số Việt Nam",
    "projects.ongoing.project2.description":
      "Phát triển hệ sinh thái xuất bản số toàn diện, hỗ trợ các nhà xuất bản chuyển đổi số và tiếp cận độc giả trẻ",
    "projects.ongoing.project2.participants": "30+ nhà xuất bản",
    "projects.ongoing.project2.budget": "5 tỷ VNĐ",
    "projects.ongoing.project3.title": "Chương trình Đọc sách cho Trẻ em Vùng cao",
    "projects.ongoing.project3.description":
      "Mang sách và kiến thức đến với trẻ em vùng cao, xây dựng thói quen đọc từ nhỏ và nâng cao chất lượng giáo dục",
    "projects.ongoing.project3.participants": "100+ trường học",
    "projects.ongoing.project3.budget": "1.8 tỷ VNĐ",
    "projects.completed.project1.title": "Tháng ba biên giới tại Huyện Tri Tôn",
    "projects.completed.project1.description":
      "Nhằm giáo dục truyền thống cách mạng, tuyên truyền sâu rộng trong hội viên, thanh niên về ý thức xây dựng đường biên giới hòa bình, ổn định, hữu nghị, hợp tác và phát triển bền vững",
    "projects.completed.project1.participants": "10,000+ người tham gia",
    "projects.completed.project1.results": "Báo cáo 200 trang",
    "projects.completed.project2.title": "Hội chợ Sách Xanh Hà Nội 2024",
    "projects.completed.project2.description":
      "Tổ chức hội chợ sách với chủ đề bảo vệ môi trường, thu hút hàng nghìn độc giả và nhà xuất bản tham gia",
    "projects.completed.project2.participants": "50,000+ khách tham quan",
    "projects.completed.project2.results": "200+ gian hàng",

    // Footer
    "footer.brand": "Trung tâm Phát triển Văn hóa đọc\nvà Kinh tế Xuất bản - Đơn vị trực thuộc Hội Xuất bản Việt Nam",
    "footer.connect": "Kết nối với chúng tôi",
    "footer.quicklinks": "Liên kết nhanh",
    "footer.quicklinks.about": "Về chúng tôi",
    "footer.quicklinks.news": "Tin tức & Sự kiện",
    "footer.quicklinks.programs": "Chương trình văn hóa đọc",
    "footer.quicklinks.support": "Hỗ trợ xuất bản",
    "footer.quicklinks.partners": "Đối tác",
    "footer.quicklinks.careers": "Tuyển dụng",
    "footer.orginfo": "Thông tin tổ chức",
    "footer.orginfo.fullname": "Tên đầy đủ:",
    "footer.orginfo.fullname.value": "Trung tâm Phát triển Văn hóa đọc\nvà Kinh tế Xuất bản",
    "footer.orginfo.english": "Tên tiếng Anh:",
    "footer.orginfo.english.value": "Center for Developing Reading Culture and Publishing Economy",
    "footer.orginfo.established": "Năm thành lập:",
    "footer.orginfo.established.value": "01/04/2024",
    "footer.orginfo.parent": "Đơn vị chủ quản:",
    "footer.orginfo.parent.value": "Hội Xuất bản Việt Nam",
    "footer.contact": "Thông tin liên hệ",
    "footer.copyright": "2024 Trung tâm Phát triển Văn hóa đọc\nvà Kinh tế Xuất bản. Tất cả quyền được bảo lưu.",
    "footer.privacy": "Chính sách bảo mật",
    "footer.terms": "Điều khoản sử dụng",
    "footer.sitemap": "Sơ đồ trang web",

    // Logo and Brand Elements
    "brand.reading.culture.center": "Trung tâm Văn hóa Đọc",
    "brand.since.2024": "Từ năm 2024",
    "brand.logo.alt": "Logo RCP",

    // Contact Modal
    "contact.modal.title": "Liên hệ với chúng tôi",
    "contact.modal.subtitle": "Chúng tôi rất mong được nghe từ bạn",
    "contact.modal.thank.you": "Cảm ơn bạn!",
    "contact.modal.success.message": "Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại với bạn sớm nhất.",
    "contact.modal.closing": "Cửa sổ này sẽ tự động đóng...",
    "contact.modal.personal.info": "Thông tin cá nhân",
    "contact.modal.professional.info": "Thông tin nghề nghiệp",
    "contact.modal.full.name": "Họ và tên",
    "contact.modal.phone": "Số điện thoại",
    "contact.modal.organization": "Tổ chức",
    "contact.modal.position": "Chức vụ",
    "contact.modal.experience": "Kinh nghiệm",
    "contact.modal.expectations": "Mong muốn",
    "contact.modal.agree.terms": "Tôi đồng ý với các điều khoản và chính sách bảo mật",
    "contact.modal.agree.terms.events": "Tôi đồng ý với các điều khoản và chính sách bảo mật. Tôi đồng ý nhận thông tin liên lạc về sự kiện này.",
    "contact.modal.cancel": "Hủy",
    "contact.modal.sending": "Đang gửi...",
    "contact.modal.send.message": "Gửi tin nhắn",
    "contact.modal.placeholder.name": "Nhập họ và tên của bạn",
    "contact.modal.placeholder.email": "Nhập email của bạn",
    "contact.modal.placeholder.phone": "Nhập số điện thoại",
    "contact.modal.placeholder.organization": "Nhập tên tổ chức",
    "contact.modal.placeholder.position": "Nhập chức vụ của bạn",
    "contact.modal.placeholder.experience": "Chia sẻ về kinh nghiệm của bạn...",
    "contact.modal.placeholder.expectations": "Bạn mong muốn điều gì?",
    "contact.modal.message": "Lời nhắn",
    "contact.modal.placeholder.message": "Thông tin bổ sung...",

    // Event Registration Modal
    "event.registration.title": "Đăng ký sự kiện",
    "event.registration.subtitle": "Vui lòng điền thông tin để đăng ký",
    "event.registration.success.title": "Đăng ký thành công!",
    "event.registration.success.message": "Cảm ơn bạn đã đăng ký tham gia sự kiện. Chúng tôi sẽ gửi email xác nhận và thông tin chi tiết sớm nhất.",
    "event.registration.register.now": "Đăng ký ngay",
    "event.registration.registering": "Đang đăng ký...",
    "event.registration.agree.terms": "Tôi đồng ý với các điều khoản và điều kiện của sự kiện. Tôi hiểu rằng thông tin cá nhân sẽ được sử dụng để liên lạc về sự kiện này.",

    // News
    "news.read.more": "Đọc thêm",
    "news.latest.title": "Tin tức mới nhất",
    "news.reading.culture": "Văn hóa đọc",
    "news.stay.updated": "Cập nhật những thông tin mới nhất về hoạt động phát triển văn hóa đọc, sự kiện và chương trình của trung tâm",
    "news.no.found": "Không tìm thấy tin tức",
    "news.try.change": "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc",
    "news.clear.filters": "Xóa bộ lọc",
    "news.search.filter": "Tìm kiếm & Lọc",
    "news.keywords": "Từ khóa",
    "news.enter.keywords": "Nhập từ khóa...",
    "news.category": "Danh mục",
    "news.all.categories": "Tất cả danh mục",
    "news.results": "Kết quả",
    "news.total.articles": "Tổng số bài viết:",
    "news.current.page": "Trang hiện tại:",
    "news.categories": "Danh mục:",
    "news.active.filters": "Bộ lọc đang áp dụng:",
    "news.quick.stats": "Thống kê nhanh",
    "news.total.articles.label": "Tổng bài viết",
    "news.all.news": "Tất cả tin tức",
    "news.events.title": "Tin tức & Sự kiện",
    "news.discover": "Khám phá những",

    // Event Info
    "event.info.title": "Thông tin sự kiện",
    "event.back.to.list": "Quay lại danh sách sự kiện",
    "event.description": "Mô tả sự kiện",
    "event.details": "Chi tiết sự kiện",
    "event.date": "Ngày diễn ra",
    "event.time": "Thời gian",
    "event.location": "Địa điểm",
    "event.participants": "Số lượng tham gia",
    "event.ended": "Sự kiện đã kết thúc",
    "event.cancelled": "Sự kiện đã hủy",
    "event.register": "Đăng ký tham gia",
    "event.like": "Quan tâm",
    "event.share": "Chia sẻ",
    "event.statistics": "Thống kê",
    "event.status.upcoming": "Sắp diễn ra",
    "event.status.ongoing": "Đang diễn ra",
    "event.status.completed": "Đã kết thúc",
    "event.status.cancelled": "Đã hủy",
    "event.views": "Lượt xem",
    "event.registered": "Đã đăng ký",
    "events.activities": "Sự kiện & Hoạt động",
    "events.join.our": "Tham gia các",
    "events.reading.culture": "Sự kiện văn hóa đọc",
    "events.meaningful": "Ý nghĩa & Bổ ích",
    "events.discover": "Khám phá những sự kiện thú vị, kết nối cộng đồng và cùng nhau phát triển văn hóa đọc trong xã hội",
    "events.upcoming": "Sự kiện sắp tới",
    "events.no.available": "Chưa có sự kiện nào",
    "events.check.back": "Hiện tại chưa có sự kiện nào được lên lịch. Vui lòng quay lại sau!",

    // Categories
    "category.conference": "Hội thảo",
    "category.exhibition": "Triển lãm",
    "category.activity": "Hoạt động",
    "category.training": "Đào tạo",
    "category.cooperation": "Hợp tác",
    "category.research": "Nghiên cứu",
    "category.community": "Cộng đồng",
    "category.technology": "Công nghệ",
    "category.education": "Giáo dục",
    "category.event": "Sự kiện",

    // News Detail Page
    "news.detail.completed": "Đã hoàn thành",
    "news.detail.views": "lượt xem",
    "news.detail.read.time": "phút đọc",
    "news.detail.location.label": "Địa điểm đã tổ chức",
    "news.detail.participants.label": "Đã tham gia",
    "news.detail.back.list": "Quay lại danh sách",
    "news.detail.back.home": "Quay lại trang chủ",
    "news.detail.event.report": "Báo cáo sự kiện",
    "news.detail.results.achieved": "Kết quả đạt được",
    "news.detail.memorable.moments": "Những khoảnh khắc đáng nhớ",
    "news.detail.feedback.impact": "Phản hồi & Tác động",
    "news.detail.event.gallery": "Thư viện ảnh sự kiện",
    "news.detail.gallery.stats.photos": "ảnh",
    "news.detail.gallery.stats.locations": "địa điểm",
    "news.detail.gallery.stats.children": "trẻ em",
    "news.detail.gallery.stats.volunteers": "tình nguyện viên",
    "news.detail.support.program": "Ủng hộ chương trình",
    "news.detail.share": "Chia sẻ",
    "news.detail.view.other.programs": "Xem chương trình khác",
    "news.detail.contact.support": "Liên hệ hỗ trợ",
    "news.detail.gratitude.message": "Cảm ơn sự quan tâm và ủng hộ của cộng đồng!",

    // Common UI Elements
    "common.loading": "Đang tải...",
    "common.error": "Có lỗi xảy ra",
    "common.retry": "Thử lại",
    "common.close": "Đóng",
    "common.save": "Lưu",
    "common.cancel": "Hủy",
    "common.confirm": "Xác nhận",
    "common.delete": "Xóa",
    "common.edit": "Chỉnh sửa",
    "common.view": "Xem",
    "common.download": "Tải xuống",
    "common.upload": "Tải lên",
    "common.search": "Tìm kiếm",
    "common.filter": "Lọc",
    "common.sort": "Sắp xếp",
    "common.next": "Tiếp theo",
    "common.previous": "Trước đó",
    "common.submit": "Gửi",
    "common.reset": "Đặt lại",

    // Form Validation
    "validation.required": "Trường này là bắt buộc",
    "validation.email.invalid": "Email không hợp lệ",
    "validation.phone.invalid": "Số điện thoại không hợp lệ",
    "validation.min.length": "Tối thiểu {min} ký tự",
    "validation.max.length": "Tối đa {max} ký tự",

    // Success Messages
    "success.form.submitted": "Gửi thông tin thành công!",
    "success.registration": "Đăng ký thành công!",
    "success.contact.sent": "Tin nhắn đã được gửi thành công!",

    // Error Messages
    "error.network": "Lỗi kết nối mạng",
    "error.server": "Lỗi máy chủ",
    "error.not.found": "Không tìm thấy",
    "error.permission": "Không có quyền truy cập",

    // Missing Keys
    "news.detail.gallery.click.hint": "Nhấp để xem ảnh kích thước lớn",
    "news.detail.featured": "Nổi bật",
    "news.detail.high.resolution": "Độ phân giải cao",
    "language.current": "Ngôn ngữ hiện tại",
  },
  en: {
    // Header
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.news": "News",
    "nav.events": "Events",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "header.cta": "Contact Now",
    "header.cta.mobile": "Contact Us",
    "header.language": "Language",
    "header.brand.subtitle": "Center for Developing Reading Culture and Publishing Economy",

    // Hero Section
    "hero.subtitle": "Under Vietnam Publishing Association",
    "hero.title.main": "CENTER FOR DEVELOPING READING CULTURE",
    "hero.title.highlight": "READING CULTURE", 
    "hero.title.sub": "AND PUBLISHING ECONOMY",
    "hero.description":
      "Connecting knowledge – Spreading reading culture\nAccompanying the development of Vietnam's publishing industry",
    "hero.btn.learn": "Learn More",
    "hero.btn.contact": "Contact Us",
    "hero.established": "Established",
    "hero.trust.reputation": "Leading reputation",
    "hero.trust.readers": "50K+ readers",
    "hero.trust.growth": "Sustainable growth",
    "hero.image.alt": "Research and reading culture development activities - Center for Developing Reading Culture and Publishing Economy",

    // Stats Section
    "stats.title": "Our Achievements",
    "stats.subtitle": "Impressive numbers demonstrating RCP's commitment to developing reading culture",
    "stats.programs": "Programs",
    "stats.programs.desc": "Reading culture programs",
    "stats.readers": "Readers",
    "stats.readers.desc": "Participating readers",
    "stats.support": "Support",
    "stats.support.desc": "Continuous support",
    "stats.partners": "Partners",
    "stats.partners.desc": "Strategic partners",
    "stats.bottom.message": "Together building Vietnam's reading culture",
    "stats.outstanding": "Outstanding Achievements",
    "stats.future.vietnam": "Together building Vietnam's intellectual future",

    // About Section
    "about.badge": "About Us",
    "about.title": "Center for Developing Reading Culture and Publishing Economy",
    "about.description1":
      "The Center for Developing Reading Culture and Publishing Economy (RCP) is a unit under the Vietnam Publishing Association.\n\nThe Center was established with the mission to advise and implement programs and activities to support the development of reading culture, while promoting the development of the national publishing economy.",
    "about.description2":
      'With the operating principle: "Connecting knowledge – Spreading reading culture\nAccompanying the development of Vietnam\'s publishing industry", the Center aims to build and spread reading habits in the community.',
    "about.established": "Established",
    "about.established.date": "April 1, 2024",
    "about.management": "Under",
    "about.management.org": "Vietnam Publishing Association",
    "about.mission1.title": "Connecting Knowledge",
    "about.mission1.desc":
      "Building bridges between knowledge and community, creating a sustainable learning environment",
    "about.mission2.title": "Spreading Reading Culture",
    "about.mission2.desc": "Developing reading habits, raising awareness of the value of knowledge",
    "about.mission3.title": "Accompanying Development",
    "about.mission3.desc": "Supporting Vietnam's publishing industry to develop sustainably and effectively",
    "about.pioneer.unit": "A pioneering unit in developing reading culture and promoting Vietnam's national publishing economy",
    "about.image1.title": "Modern Reading Space",
    "about.image1.desc": "Comfortable and professional learning environment",
    "about.image1.alt": "Modern reading space with young people reading books",
    "about.image2.title": "Reading Culture Development",
    "about.image2.desc": "Spreading reading culture in the community",
    "about.image2.alt": "Reading culture development in the community",

    // Vision Mission Section
    "vision.badge": "Development Orientation",
    "vision.title": "Vision - Mission - Core Values",
    "vision.vision.title": "Vision",
    "vision.vision.content":
      "The Center for Developing Reading Culture and Publishing Economy strives to become a pioneering unit in promoting reading culture and sustainable development of Vietnam's publishing industry.\n\nThe Center plays the role of a bridge between readers, publishers, book business units and state management agencies.",
    "vision.mission.title": "Mission",
    "vision.mission.content":
      "The Center aims to build a learning society where every citizen has the opportunity to access knowledge fairly and conveniently.\n\nThereby spreading the spirit of learning, improving people's intelligence, developing intellectual human resources and contributing positively to the economic, cultural and social development of the country.",
    "vision.values.title": "Core Values",
    "vision.value1.title": "Intelligence - Creativity\nCommunity Service",
    "vision.value1.desc":
      "Promoting collective intelligence, encouraging creativity and always putting community interests first",
    "vision.value2.title": "Connection - Sharing\nSustainable Development",
    "vision.value2.desc":
      "Building strong connection networks, sharing knowledge and aiming for sustainable development",
    "vision.value3.title": "Integrity - Responsibility\nRespect for Knowledge",
    "vision.value3.desc": "Operating with integrity, high responsibility and always respecting the value of knowledge",
    "vision.quote": "Knowledge is power, reading culture is the foundation of a civilized nation",
    "vision.future.knowledge": "Towards Vietnam's knowledge future",
    "vision.pioneer.technology": "Pioneering in publishing technology",
    "mission.spread.culture": "Spreading reading culture in the community",
    "mission.develop.human": "Developing intellectual human resources",
    "values.rcp.core": "RCP's Core Values",
    "values.work.culture": "Building professional and effective work culture",

    // Director Message
    "director.badge": "Leadership Message",
    "director.title": "Message from Management Board",
    "director.quote":
      "When a child loves books, a seed of knowledge is planted. When the whole community loves books, a sustainable future is being nurtured.\n\nDeveloping reading culture is a persistent and long-term journey. We are happy to contribute to that beautiful journey of the community.",
    "director.name": "Mr. Nguyen Thanh Han",
    "director.position": "Director of Center for Developing Reading Culture and Publishing Economy",

    // Partners Section
    "partners.badge": "Cooperation & Partnership",
    "partners.title": "Partner Organizations",
    "partners.description": "Join us in building a strong reading community and developing Vietnam's publishing industry",
    "partners.btn": "Become a Partner",
    "partners.list.youth_union": "Ho Chi Minh\nCommunist Youth Union",
    "partners.list.thanh_nien": "Thanh Nien\nVietnam Newspaper",
    "partners.list.tri_thuc": "Knowledge\nMagazine",
    "partners.list.ysw": "YSW - Young Social\nWorkers Organization",
    "partners.list.kim_dong": "Kim Dong\nPublishing House",
    "partners.list.huong_trang": "Huong Trang\nBooks Company",
    "partners.list.expert_club": "Love Journey\nClub",

    // Partners Categories
    "partners.category.youth": "Youth Organization",
    "partners.category.media": "Media",
    "partners.category.magazine": "Magazine",
    "partners.category.social": "Social Organization",
    "partners.category.publisher": "Publisher",
    "partners.category.bookstore": "Bookstore",
    "partners.category.club": "Club",

    // Partners Stats
    "partners.stats.partners": "Partners",
    "partners.stats.projects": "Joint Projects",
    "partners.stats.years": "Years of Cooperation",

    // News Section
    "news.badge": "Latest Updates",
    "news.title": "News & Events",
    "news.readmore": "Read more →",
    "news.description":
      "Discover the latest activities in promoting reading culture and developing the publishing industry",
    "news.cta.description": "Follow more interesting news and events from RCP",
    "news.cta.button": "View All News",
    "news.item1.title": "Community Reading Culture Development Conference",
    "news.item2.title": "Book Donation Program for Highland Children",
    "news.item3.title": "Book and Reading Culture Exhibition 2024",
    "news.item4.title": "Publishing Skills Training for Enterprises",
    "news.item5.title": "Southeast Asian Publishers Connection",
    "news.item6.title": "Youth Reading Trends Research",
    "news.discover.activities":
      "Discover the latest activities in promoting reading culture and developing the publishing industry",
    "news.subscribe.info": "Subscribe to receive information so you don't miss important news and events from RCP",
    "news.new.badge": "New",

    // Contact Section
    "contact.badge": "Contact Us",
    "contact.hero.title": "Connect with",
    "contact.hero.highlight": "RCP",
    "contact.hero.description":
      "We are always ready to listen and support you in your journey to develop reading culture",
    "contact.info.title": "Contact Information",
    "contact.address.title": "Office Address",
    "contact.address.content":
      "3rd Floor, Building A, No. 10 Duong Thanh Street,\nCua Dong Ward, Hoan Kiem District, Hanoi",
    "contact.email.title": "Email",
    "contact.phone.title": "Phone",
    "contact.hours.title": "Working Hours",
    "contact.hours.content": "Monday - Friday: 8:00 - 17:00 | Saturday: 8:00 - 12:00",
    "contact.form.title": "Send Message",
    "contact.form.description": "Leave your information and we will contact you as soon as possible",
    "contact.form.name": "Full Name",
    "contact.form.name.placeholder": "Enter your full name",
    "contact.form.phone": "Phone Number",
    "contact.form.phone.placeholder": "Enter phone number",
    "contact.form.email": "Email",
    "contact.form.email.placeholder": "Enter email address",
    "contact.form.message": "Message",
    "contact.form.message.placeholder": "Enter your message...",
    "contact.form.submit": "Send Message",
    "contact.map.badge": "Location on Map",
    "contact.map.title": "Find Your Way to RCP",
    "contact.map.description": "We are located in central Hanoi, convenient for travel by all means of transport",
    "contact.directions.title": "Directions",
    "contact.directions.bus": "Bus",
    "contact.directions.bus.desc": "Routes 09, 14, 18 - Stop at Hoan Kiem Lake",
    "contact.directions.car": "Motorbike/Car",
    "contact.directions.car.desc": "Parking available in the building",
    "contact.directions.taxi": "Taxi/Grab",
    "contact.directions.taxi.desc": "Easy to call from anywhere in the city",
    "contact.nearby.title": "Nearby Locations",
    "contact.nearby.hoankiem": "Hoan Kiem Lake",
    "contact.nearby.cathedral": "St. Joseph's Cathedral",
    "contact.nearby.oldquarter": "Hanoi Old Quarter",
    "contact.nearby.postoffice": "Hanoi Post Office",
    "contact.directions.btn": "Get Directions with Google Maps",

    // About Page
    "about.page.title": "About Us",
    "about.page.hero.title": "Center for Developing",
    "about.page.hero.highlight": "Reading Culture",
    "about.page.hero.sub": "and Publishing Economy",
    "about.page.hero.description":
      "Under Vietnam Publishing Association, pioneering in developing reading culture and promoting the national publishing economy",
    "about.page.intro.title": "General Introduction",
    "about.page.structure.title": "Organizational Structure",
    "about.page.management": "Management Board",
    "about.page.admin": "Administration Department",
    "about.page.programs": "Programs Department",
    "about.page.external": "External Relations Department",
    "about.page.members": "members",

    // Events Page
    "events.page.title": "Events & Activities",
    "events.page.hero.title": "Events by",
    "events.page.hero.highlight": "RCP",
    "events.page.hero.description":
      "Join our events, seminars and activities to develop reading culture and Vietnam's publishing industry together",
    "events.upcoming.title": "Upcoming Events",
    "events.past.title": "Past Events",
    "events.status.upcoming": "Upcoming",
    "events.status.completed": "Completed",
    "events.participants": "participants",
    "events.participants.past": "participants attended",
    "events.register": "Register",
    "events.report": "View Report",

    // Events Data
    "events.upcoming.event1.title": "Community Reading Culture Development Conference 2025",
    "events.upcoming.event1.location": "National Convention Center, Hanoi",
    "events.upcoming.event2.title": "Vietnam Book and Reading Culture Exhibition 2025",
    "events.upcoming.event2.location": "Giang Vo Exhibition Center, Hanoi",
    "events.upcoming.event3.title": "Book Donation Program for Highland Children",
    "events.upcoming.event3.location": "Lai Chau Province",
    "events.past.event1.title": "Publishing Skills Training for Enterprises",
    "events.past.event1.location": "Lotte Hotel, Hanoi",
    "events.past.event2.title": "Southeast Asian Publishers Connection",
    "events.past.event2.location": "JW Marriott Conference Center",
    "events.past.event3.title": "Youth Reading Trends Research",
    "events.past.event3.location": "Vietnam National University, Hanoi",

    // Projects Page
    "projects.page.title": "Projects & Programs",
    "projects.page.hero.title": "Projects by",
    "projects.page.hero.highlight": "RCP",
    "projects.page.hero.description":
      "Explore the projects and programs we are implementing to develop reading culture and the publishing industry",
    "projects.ongoing.title": "Ongoing Projects",
    "projects.completed.title": "Completed Projects",
    "projects.status.ongoing": "Ongoing",
    "projects.status.completed": "Completed",
    "projects.progress": "Progress",
    "projects.details": "View Details",
    "projects.report": "View Report",
    "projects.results.label": "Results",
    "projects.stats.title": "Project Statistics",
    "projects.stats.completed": "Completed Projects",
    "projects.stats.ongoing": "Ongoing Projects",
    "projects.stats.beneficiaries": "Beneficiaries",
    "projects.stats.partners": "Partners",

    // Projects Data
    "projects.ongoing.project1.title": "Community Green Library Program",
    "projects.ongoing.project1.description":
      "Building a network of green libraries in residential areas, schools and offices to promote sustainable reading culture",
    "projects.ongoing.project1.participants": "50+ communities",
    "projects.ongoing.project1.budget": "2.5 billion VND",
    "projects.ongoing.project2.title": "Vietnam Digital Publishing Platform",
    "projects.ongoing.project2.description":
      "Developing a comprehensive digital publishing ecosystem, supporting publishers in digital transformation and reaching young readers",
    "projects.ongoing.project2.participants": "30+ publishers",
    "projects.ongoing.project2.budget": "5 billion VND",
    "projects.ongoing.project3.title": "Reading Program for Highland Children",
    "projects.ongoing.project3.description":
      "Bringing books and knowledge to highland children, building reading habits from an early age and improving education quality",
    "projects.ongoing.project3.participants": "100+ schools",
    "projects.ongoing.project3.budget": "1.8 billion VND",
    "projects.completed.project1.title": "March border in Tri Ton district",
    "projects.completed.project1.description":
      "To educate revolutionary traditions, widely propagate among members and youth about the awareness of building a peaceful, stable, friendly, cooperative and sustainable development border.",
    "projects.completed.project1.participants": "10,000+ participants",
    "projects.completed.project1.results": "200-page report",
    "projects.completed.project2.title": "Hanoi Green Book Fair 2024",
    "projects.completed.project2.description":
      "Organizing a book fair with environmental protection theme, attracting thousands of readers and publishers",
    "projects.completed.project2.participants": "50,000+ visitors",
    "projects.completed.project2.results": "200+ booths",

    // Footer
    "footer.brand":
      "Center for Developing Reading Culture\nand Publishing Economy - Under Vietnam Publishing Association",
    "footer.connect": "Connect with us",
    "footer.quicklinks": "Quick Links",
    "footer.quicklinks.about": "About Us",
    "footer.quicklinks.news": "News & Events",
    "footer.quicklinks.programs": "Reading Culture Programs",
    "footer.quicklinks.support": "Publishing Support",
    "footer.quicklinks.partners": "Partners",
    "footer.quicklinks.careers": "Careers",
    "footer.orginfo": "Organization Info",
    "footer.orginfo.fullname": "Full Name:",
    "footer.orginfo.fullname.value": "Center for Developing Reading Culture\nand Publishing Economy",
    "footer.orginfo.english": "English Name:",
    "footer.orginfo.english.value": "Center for Developing Reading Culture and Publishing Economy",
    "footer.orginfo.established": "Established:",
    "footer.orginfo.established.value": "April 1, 2024",
    "footer.orginfo.parent": "Parent Organization:",
    "footer.orginfo.parent.value": "Vietnam Publishing Association",
    "footer.contact": "Contact Info",
    "footer.copyright": "2024 Center for Developing Reading Culture\nand Publishing Economy. All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Use",
    "footer.sitemap": "Sitemap",

    // Logo and Brand Elements
    "brand.reading.culture.center": "Reading Culture Center",
    "brand.since.2024": "Since 2024",
    "brand.logo.alt": "RCP Logo",

    // Contact Modal
    "contact.modal.title": "Contact Us",
    "contact.modal.subtitle": "We'd love to hear from you",
    "contact.modal.thank.you": "Thank you!",
    "contact.modal.success.message": "Your message has been sent successfully. We will get back to you soon.",
    "contact.modal.closing": "This window will close automatically...",
    "contact.modal.personal.info": "Personal Information",
    "contact.modal.professional.info": "Professional Information",
    "contact.modal.full.name": "Full Name",
    "contact.modal.phone": "Phone Number",
    "contact.modal.organization": "Organization",
    "contact.modal.position": "Position",
    "contact.modal.experience": "Experience",
    "contact.modal.expectations": "Expectations",
    "contact.modal.agree.terms": "I agree to the terms and conditions and privacy policy",
    "contact.modal.agree.terms.events": "I agree to the terms and conditions and privacy policy. I agree to receive communication about this event.",
    "contact.modal.cancel": "Cancel",
    "contact.modal.sending": "Sending...",
    "contact.modal.send.message": "Send Message",
    "contact.modal.placeholder.name": "Enter your full name",
    "contact.modal.placeholder.email": "Enter your email",
    "contact.modal.placeholder.phone": "Enter phone number",
    "contact.modal.placeholder.organization": "Enter organization name",
    "contact.modal.placeholder.position": "Enter your position",
    "contact.modal.placeholder.experience": "Tell us about your experience...",
    "contact.modal.placeholder.expectations": "What are your expectations?",
    "contact.modal.message": "Message",
    "contact.modal.placeholder.message": "Any additional information...",

    // Event Registration Modal
    "event.registration.title": "Event Registration",
    "event.registration.subtitle": "Please fill in your information to register",
    "event.registration.success.title": "Registration Successful!",
    "event.registration.success.message": "Thank you for registering for the event. We will send you a confirmation email and detailed information soon.",
    "event.registration.register.now": "Register Now",
    "event.registration.registering": "Registering...",
    "event.registration.agree.terms": "I agree to the terms and conditions of the event. I understand that personal information will be used to communicate about this event.",
    "event.registration.check.email": "Check your email for detailed information",

    // News
    "news.read.more": "Read more",
    "news.latest.title": "Latest News",
    "news.reading.culture": "Reading Culture", 
    "news.stay.updated": "Stay updated with the latest information about reading culture development activities, events and center programs",
    "news.no.found": "No news found",
    "news.try.change": "Try changing your search terms or filters",
    "news.clear.filters": "Clear filters",
    "news.search.filter": "Search & Filter",
    "news.keywords": "Keywords",
    "news.enter.keywords": "Enter keywords...",
    "news.category": "Category",
    "news.all.categories": "All categories",
    "news.results": "Results",
    "news.total.articles": "Total articles:",
    "news.current.page": "Current page:",
    "news.categories": "Categories:",
    "news.active.filters": "Active filters:",
    "news.quick.stats": "Quick Stats",
    "news.total.articles.label": "Total Articles",
    "news.all.news": "All news",
    "news.events.title": "News & Events",
    "news.discover": "Discover the",
    "news.types": "News types",
    "news.page.current": "Current Page", 
    "news.position.current": "Current position",
    "news.detail.gallery.click.hint": "Click to view full-size image",
    "news.detail.featured": "Featured",
    "news.detail.high.resolution": "High Resolution",

    // Language
    "language.current": "Current Language",

    // Event Info
    "event.info.title": "Event Information",
    "event.back.to.list": "Back to events list",
    "event.description": "Event Description",
    "event.details": "Event Details",
    "event.date": "Date",
    "event.time": "Time",
    "event.location": "Location",
    "event.participants": "Participants",
    "event.ended": "Event ended",
    "event.cancelled": "Event cancelled",
    "event.register": "Register to participate",
    "event.like": "Like",
    "event.share": "Share",
    "event.statistics": "Statistics",
    "event.status.upcoming": "Upcoming",
    "event.status.ongoing": "Ongoing",
    "event.status.completed": "Completed",
    "event.status.cancelled": "Cancelled",
    "event.views": "Views",
    "event.registered": "Registered",
    "event.not.found": "Event not found",
    "events.activities": "Events & Activities",
    "events.join.our": "Join Our",
    "events.reading.culture": "Reading Culture Events",
    "events.meaningful": "Meaningful & Valuable",
    "events.discover": "Discover exciting events, connect with community and develop reading culture together in society",
    "events.upcoming": "Upcoming Events",
    "events.no.available": "No events available",
    "events.check.back": "There are no events scheduled at the moment. Please check back later!",

    // Categories
    "category.conference": "Conference",
    "category.exhibition": "Exhibition",
    "category.activity": "Activity",
    "category.training": "Training",
    "category.cooperation": "Cooperation",
    "category.research": "Research",
    "category.community": "Community",
    "category.technology": "Technology",
    "category.education": "Education",
    "category.event": "Event",

    // News Detail Page
    "news.detail.completed": "Completed",
    "news.detail.views": "views",
    "news.detail.read.time": "min read",
    "news.detail.location.label": "Event Location",
    "news.detail.participants.label": "Participated",
    "news.detail.back.list": "Back to List",
    "news.detail.back.home": "Back to Home",
    "news.detail.event.report": "Event Report",
    "news.detail.results.achieved": "Results Achieved",
    "news.detail.memorable.moments": "Memorable Moments",
    "news.detail.feedback.impact": "Feedback & Impact",
    "news.detail.event.gallery": "Event Gallery",
    "news.detail.gallery.stats.photos": "photos",
    "news.detail.gallery.stats.locations": "locations",
    "news.detail.gallery.stats.children": "children",
    "news.detail.gallery.stats.volunteers": "volunteers",
    "news.detail.support.program": "Support Program",
    "news.detail.share": "Share",
    "news.detail.view.other.programs": "View Other Programs", 
    "news.detail.contact.support": "Contact Support",
    "news.detail.gratitude.message": "Thank you for your interest and support from the community!",
    "news.detail.published": "Published",
    "news.detail.draft": "Draft",
    "news.detail.gallery.description": "Explore {count} exclusive photos from this event",
    "news.detail.gallery.click.hint": "Click on images for details",
    "news.detail.featured": "Featured",
    "news.detail.high.resolution": "High resolution",

    // Common UI Elements
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.retry": "Retry",
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.download": "Download",
    "common.upload": "Upload",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.reset": "Reset",

    // Form Validation
    "validation.required": "This field is required",
    "validation.email.invalid": "Invalid email address",
    "validation.phone.invalid": "Invalid phone number",
    "validation.min.length": "Minimum {min} characters",
    "validation.max.length": "Maximum {max} characters",

    // Success Messages
    "success.form.submitted": "Form submitted successfully!",
    "success.registration": "Registration successful!",
    "success.contact.sent": "Message sent successfully!",

    // Error Messages
    "error.network": "Network connection error",
    "error.server": "Server error", 
    "error.not.found": "Not found",
    "error.permission": "Access denied",

    // Language
    "language.current": "Current:",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "vi" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
