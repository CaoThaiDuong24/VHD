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
    "hero.title.main": "TRUNG TÂM PHÁT TRIỂN",
    "hero.title.highlight": "VĂN HÓA ĐỌC",
    "hero.title.sub": "VÀ KINH TẾ XUẤT BẢN",
    "hero.description": "Kết nối tri thức – Lan tỏa văn hóa đọc – Đồng hành cùng sự phát triển ngành xuất bản Việt Nam",
    "hero.btn.learn": "Tìm hiểu thêm",
    "hero.btn.contact": "Liên hệ với chúng tôi",
    "hero.established": "Thành lập",
    "hero.trust.reputation": "Uy tín hàng đầu",
    "hero.trust.readers": "50K+ độc giả",
    "hero.trust.growth": "Tăng trưởng bền vững",

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
      "Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản (Center for Developing Reading Culture and Publishing Economy - RCP) là đơn vị trực thuộc Hội Xuất bản Việt Nam, được thành lập với sứ mệnh tham mưu và triển khai các chương trình, hoạt động hỗ trợ phát triển văn hóa đọc, đồng thời thúc đẩy sự phát triển của nền kinh tế xuất bản quốc gia.",
    "about.description2":
      'Với tôn chỉ hoạt động: "Kết nối tri thức – Lan tỏa văn hóa đọc – Đồng hành cùng sự phát triển ngành xuất bản Việt Nam", Trung tâm hướng tới việc xây dựng và lan tỏa thói quen đọc sách trong cộng đồng.',
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
    "about.pioneer.unit":
      "Đơn vị tiên phong trong việc phát triển văn hóa đọc và thúc đẩy nền kinh tế xuất bản Việt Nam",

    // Vision Mission Section
    "vision.badge": "Định hướng phát triển",
    "vision.title": "Tầm nhìn - Sứ mệnh - Giá trị cốt lõi",
    "vision.vision.title": "Tầm nhìn",
    "vision.vision.content":
      "Trung tâm Phát triển Văn hóa Đọc và Kinh tế Xuất bản phấn đấu trở thành một đơn vị tiên phong, uy tín hàng đầu trong việc thúc đẩy văn hóa đọc và phát triển bền vững ngành xuất bản Việt Nam, đóng vai trò cầu nối giữa độc giả, các nhà xuất bản, các đơn vị kinh doanh sách và cơ quan quản lý Nhà nước.",
    "vision.mission.title": "Sứ mệnh",
    "vision.mission.content":
      "Trung tâm hướng tới xây dựng một xã hội học tập, nơi mỗi người dân đều có điều kiện tiếp cận tri thức một cách công bằng, thuận tiện, từ đó lan tỏa tinh thần hiếu học, nâng cao dân trí, phát triển nguồn nhân lực tri thức và đóng góp tích cực vào sự phát triển kinh tế - văn hóa - xã hội của đất nước.",
    "vision.values.title": "Giá trị cốt lõi",
    "vision.value1.title": "Trí tuệ - Sáng tạo - Phụng sự cộng đồng",
    "vision.value1.desc": "Phát huy trí tuệ tập thể, khuyến khích sáng tạo và luôn đặt lợi ích cộng đồng lên hàng đầu",
    "vision.value2.title": "Kết nối - Chia sẻ - Phát triển bền vững",
    "vision.value2.desc": "Xây dựng mạng lưới kết nối mạnh mẽ, chia sẻ tri thức và hướng tới phát triển bền vững",
    "vision.value3.title": "Chính trực - Trách nhiệm - Tôn trọng tri thức",
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
      "Khi một đứa trẻ yêu sách, là một hạt giống tri thức được gieo trồng. Khi cả cộng đồng yêu sách, là một tương lai bền vững đang được vun đắp. Phát triển văn hóa đọc là hành trình bền bỉ và lâu dài. Chúng tôi hạnh phúc khi được góp phần vào hành trình đẹp đẽ ấy của cộng đồng.",
    "director.name": "Ông Nguyễn Thanh Hân",
    "director.position": "Giám đốc Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản",

    // Partners Section
    "partners.badge": "Hợp tác & Liên kết",
    "partners.title": "Đơn vị đồng hành",
    "partners.description": "Cùng chúng tôi xây dựng một cộng đồng đọc mạnh mẽ và phát triển ngành xuất bản Việt Nam",
    "partners.btn": "Trở thành đối tác",
    "partners.list.youth_union": "Đoàn Thanh niên Cộng sản Hồ Chí Minh",
    "partners.list.thanh_nien": "Báo Thanh Niên Việt Nam",
    "partners.list.tri_thuc": "Tạp chí Tri thức",
    "partners.list.ysw": "YSW - Tổ chức Công tác xã hội trẻ",
    "partners.list.kim_dong": "Nhà xuất bản Kim Đồng",
    "partners.list.huong_trang": "Công ty Sách Hương Trang",
    "partners.list.expert_club": "Câu lạc bộ Chuyến xe Yêu thương",

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
      "Khám phá những hoạt động mới nhất trong việc thúc đẩy văn hóa đọc và phát triển ngành xuất bản...",
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
    "contact.address.content": "Tầng 3, Nhà A, Số 10 Đường Thành, Phường Cửa Đông, Quận Hoàn Kiếm, Hà Nội",
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
    "footer.brand": "Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản - Đơn vị trực thuộc Hội Xuất bản Việt Nam",
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
    "footer.orginfo.fullname.value": "Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản",
    "footer.orginfo.english": "Tên tiếng Anh:",
    "footer.orginfo.english.value": "Center for Developing Reading Culture and Publishing Economy",
    "footer.orginfo.established": "Năm thành lập:",
    "footer.orginfo.established.value": "01/04/2024",
    "footer.orginfo.parent": "Đơn vị chủ quản:",
    "footer.orginfo.parent.value": "Hội Xuất bản Việt Nam",
    "footer.contact": "Thông tin liên hệ",
    "footer.copyright": "2024 Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản. Tất cả quyền được bảo lưu.",
    "footer.privacy": "Chính sách bảo mật",
    "footer.terms": "Điều khoản sử dụng",
    "footer.sitemap": "Sơ đồ trang web",

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
    "hero.title.main": "CENTER FOR DEVELOPING",
    "hero.title.highlight": "READING CULTURE",
    "hero.title.sub": "AND PUBLISHING ECONOMY",
    "hero.description":
      "Connecting knowledge – Spreading reading culture – Accompanying the development of Vietnam's publishing industry",
    "hero.btn.learn": "Learn More",
    "hero.btn.contact": "Contact Us",
    "hero.established": "Established",
    "hero.trust.reputation": "Leading reputation",
    "hero.trust.readers": "50K+ readers",
    "hero.trust.growth": "Sustainable growth",

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
      "The Center for Developing Reading Culture and Publishing Economy (RCP) is a unit under the Vietnam Publishing Association, established with the mission to advise and implement programs and activities to support the development of reading culture, while promoting the development of the national publishing economy.",
    "about.description2":
      'With the operating principle: "Connecting knowledge – Spreading reading culture – Accompanying the development of Vietnam\'s publishing industry", the Center aims to build and spread reading habits in the community.',
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
    "about.pioneer.unit":
      "A pioneering unit in developing reading culture and promoting Vietnam's national publishing economy",

    // Vision Mission Section
    "vision.badge": "Development Orientation",
    "vision.title": "Vision - Mission - Core Values",
    "vision.vision.title": "Vision",
    "vision.vision.content":
      "The Center for Developing Reading Culture and Publishing Economy strives to become a pioneering, leading prestigious unit in promoting reading culture and sustainable development of Vietnam's publishing industry, playing the role of a bridge between readers, publishers, book business units and state management agencies.",
    "vision.mission.title": "Mission",
    "vision.mission.content":
      "The Center aims to build a learning society where every citizen has the opportunity to access knowledge fairly and conveniently, thereby spreading the spirit of learning, improving people's intelligence, developing intellectual human resources and contributing positively to the economic, cultural and social development of the country.",
    "vision.values.title": "Core Values",
    "vision.value1.title": "Intelligence - Creativity - Community Service",
    "vision.value1.desc":
      "Promoting collective intelligence, encouraging creativity and always putting community interests first",
    "vision.value2.title": "Connection - Sharing - Sustainable Development",
    "vision.value2.desc":
      "Building strong connection networks, sharing knowledge and aiming for sustainable development",
    "vision.value3.title": "Integrity - Responsibility - Respect for Knowledge",
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
      "When a child loves books, a seed of knowledge is planted. When the whole community loves books, a sustainable future is being nurtured. Developing reading culture is a persistent and long-term journey. We are happy to contribute to that beautiful journey of the community.",
    "director.name": "Mr. Nguyen Thanh Han",
    "director.position": "Director of Center for Developing Reading Culture and Publishing Economy",

    // Partners Section
    "partners.badge": "Cooperation & Partnership",
    "partners.title": "Partner Organizations",
    "partners.description":
      "Join us in building a strong reading community and developing Vietnam's publishing industry",
    "partners.btn": "Become a Partner",
    "partners.list.youth_union": "Ho Chi Minh Communist Youth Union",
    "partners.list.thanh_nien": "Thanh Nien Vietnam Newspaper",
    "partners.list.tri_thuc": "Knowledge Magazine",
    "partners.list.ysw": "YSW - Young Social Workers Organization",
    "partners.list.kim_dong": "Kim Dong Publishing House",
    "partners.list.huong_trang": "Huong Trang Books Company",
    "partners.list.expert_club": "Love Journey Club",

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
      "Discover the latest activities in promoting reading culture and developing the publishing industry...",
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
      "3rd Floor, Building A, No. 10 Duong Thanh Street, Cua Dong Ward, Hoan Kiem District, Hanoi",
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
      "Center for Developing Reading Culture and Publishing Economy - Under Vietnam Publishing Association",
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
    "footer.orginfo.fullname.value": "Center for Developing Reading Culture and Publishing Economy",
    "footer.orginfo.english": "English Name:",
    "footer.orginfo.english.value": "Center for Developing Reading Culture and Publishing Economy",
    "footer.orginfo.established": "Established:",
    "footer.orginfo.established.value": "April 1, 2024",
    "footer.orginfo.parent": "Parent Organization:",
    "footer.orginfo.parent.value": "Vietnam Publishing Association",
    "footer.contact": "Contact Info",
    "footer.copyright": "2024 Center for Developing Reading Culture and Publishing Economy. All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Use",
    "footer.sitemap": "Sitemap",

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
