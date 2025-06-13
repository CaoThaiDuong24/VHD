export interface NewsItem {
  id: number;
  title: string;
  titleEn: string;
  image: string;
  category: string;
  categoryEn: string;
  date: string;
  gradient: string;
  location: string;
  locationEn: string;
  participants: string;
  participantsEn: string;
  description: string;
  descriptionEn: string;
  detailContent: string;
  detailContentEn: string;
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Hội thảo Phát triển văn hóa đọc trong cộng đồng",
    titleEn: "Community Reading Culture Development Conference",
    image: "/images/hoi_xuat_ban.png",
    category: "Hội thảo",
    categoryEn: "Conference",
    date: "15/12/2024",
    gradient: "from-primary to-emerald-500",
    location: "Trung tâm Hội nghị Quốc gia, Hà Nội",
    locationEn: "National Convention Center, Hanoi",
    participants: "250+ người tham gia",
    participantsEn: "250+ participants",
    description: "Khám phá những hoạt động mới nhất trong việc thúc đẩy văn hóa đọc và phát triển ngành xuất bản...",
    descriptionEn: "Discover the latest activities in promoting reading culture and developing the publishing industry...",
    detailContent: "Hội thảo Phát triển văn hóa đọc trong cộng đồng là sự kiện quan trọng nhằm tập hợp các chuyên gia, nhà giáo dục, và những người quan tâm đến việc xây dựng thói quen đọc sách trong xã hội. Sự kiện sẽ thảo luận về các phương pháp hiệu quả để khuyến khích người dân, đặc biệt là trẻ em và thanh thiếu niên, yêu thích đọc sách.\n\nCác chủ đề chính bao gồm:\n• Vai trò của gia đình trong việc nuôi dưỡng thói quen đọc\n• Ứng dụng công nghệ trong việc tiếp cận sách\n• Xây dựng thư viện cộng đồng\n• Các chương trình khuyến đọc sáng tạo\n\nHội thảo quy tụ hơn 250 chuyên gia, nhà giáo dục và những người yêu sách từ khắp cả nước. Đây là cơ hội tuyệt vời để chia sẻ kinh nghiệm, học hỏi từ các mô hình thành công và xây dựng mạng lưới hợp tác trong việc phát triển văn hóa đọc.",
    detailContentEn: "The Community Reading Culture Development Conference is an important event that brings together experts, educators, and those interested in building reading habits in society. The event will discuss effective methods to encourage people, especially children and adolescents, to love reading books.\n\nMain topics include:\n• The role of family in nurturing reading habits\n• Applying technology in book access\n• Building community libraries\n• Creative reading promotion programs\n\nThe conference brings together more than 250 experts, educators and book lovers from across the country. This is a great opportunity to share experiences, learn from successful models and build cooperation networks in developing reading culture."
  },
  {
    id: 2,
    title: "Chương trình tặng sách cho trẻ em vùng cao",
    titleEn: "Book Donation Program for Highland Children",
    image: "/images/Le khanh thanh.jpg",
    category: "Hoạt động",
    categoryEn: "Activity",
    date: "10/12/2024",
    gradient: "from-emerald-500 to-teal-500",
    location: "Tỉnh Lai Châu",
    locationEn: "Lai Chau Province",
    participants: "500+ trẻ em được hỗ trợ",
    participantsEn: "500+ children supported",
    description: "Khám phá những hoạt động mới nhất trong việc thúc đẩy văn hóa đọc và phát triển ngành xuất bản...",
    descriptionEn: "Discover the latest activities in promoting reading culture and developing the publishing industry...",
    detailContent: "Chương trình tặng sách cho trẻ em vùng cao là hoạt động thiện nguyện ý nghĩa nhằm mang tri thức đến với các em nhỏ ở những vùng khó khăn. Chương trình không chỉ trao tặng sách mà còn tổ chức các hoạt động đọc sách cùng nhau, kể chuyện, và hướng dẫn các em cách chăm sóc sách.\n\nNội dung chương trình:\n• Trao tặng 10,000 cuốn sách cho 50 trường học\n• Xây dựng 20 góc đọc sách tại các trường\n• Đào tạo 100 giáo viên về phương pháp khuyến đọc\n• Tổ chức 30 buổi kể chuyện cho trẻ em\n\nĐây là cơ hội để các em tiếp cận với thế giới tri thức rộng lớn, phát triển tư duy sáng tạo và nuôi dưỡng tình yêu học tập. Chương trình cũng trao tặng các thiết bị học tập cần thiết và xây dựng các góc đọc sách tại trường học địa phương.",
    detailContentEn: "The Book Donation Program for Highland Children is a meaningful charitable activity aimed at bringing knowledge to children in difficult areas. The program not only donates books but also organizes reading activities together, storytelling, and guides children on how to take care of books.\n\nProgram content:\n• Donate 10,000 books to 50 schools\n• Build 20 reading corners at schools\n• Train 100 teachers on reading promotion methods\n• Organize 30 storytelling sessions for children\n\nThis is an opportunity for children to access the vast world of knowledge, develop creative thinking and nurture their love of learning. The program also donates necessary learning equipment and builds reading corners at local schools."
  },
  {
    id: 3,
    title: "Triển lãm sách và văn hóa đọc 2024",
    titleEn: "Book and Reading Culture Exhibition 2024",
    image: "/images/modern-reading-space.jpg",
    category: "Triển lãm",
    categoryEn: "Exhibition",
    date: "05/12/2024",
    gradient: "from-green-600 to-lime-600",
    location: "Trung tâm Triển lãm Giảng Võ, Hà Nội",
    locationEn: "Giang Vo Exhibition Center, Hanoi",
    participants: "10,000+ khách tham quan",
    participantsEn: "10,000+ visitors",
    description: "Khám phá những hoạt động mới nhất trong việc thúc đẩy văn hóa đọc và phát triển ngành xuất bản...",
    descriptionEn: "Discover the latest activities in promoting reading culture and developing the publishing industry...",
    detailContent: "Triển lãm sách và văn hóa đọc 2024 là sự kiện lớn quy tụ hàng trăm nhà xuất bản, tác giả và những người yêu sách. Triển lãm giới thiệu những ấn phẩm mới nhất, các tác phẩm văn học kinh điển và sách chuyên ngành.\n\nĐiểm nổi bật của triển lãm:\n• 200+ gian hàng từ 100+ nhà xuất bản\n• Khu vực trải nghiệm công nghệ đọc hiện đại\n• Sách điện tử, audiobook và ứng dụng đọc thông minh\n• 50+ talkshow với các tác giả nổi tiếng\n• Workshop viết sách và kỹ năng đọc hiệu quả\n• Cuộc thi văn hóa đọc dành cho mọi lứa tuổi\n\nTriển lãm không chỉ là nơi giới thiệu sách mà còn là không gian văn hóa, nơi gặp gỡ và giao lưu giữa các tác giả, nhà xuất bản và độc giả.",
    detailContentEn: "The 2024 Book and Reading Culture Exhibition is a major event bringing together hundreds of publishers, authors and book lovers. The exhibition introduces the latest publications, classic literary works and specialized books.\n\nExhibition highlights:\n• 200+ booths from 100+ publishers\n• Modern reading technology experience area\n• E-books, audiobooks and smart reading applications\n• 50+ talkshows with famous authors\n• Book writing and effective reading skills workshops\n• Reading culture competitions for all ages\n\nThe exhibition is not only a place to introduce books but also a cultural space, a meeting and exchange place between authors, publishers and readers."
  },
  {
    id: 4,
    title: "Đào tạo kỹ năng xuất bản cho doanh nghiệp",
    titleEn: "Publishing Skills Training for Enterprises",
    image: "/images/modern-library/professional-reading-space.jpeg",
    category: "Đào tạo",
    categoryEn: "Training",
    date: "01/12/2024",
    gradient: "from-amber-500 to-orange-500",
    location: "Khách sạn Lotte, Hà Nội",
    locationEn: "Lotte Hotel, Hanoi",
    participants: "100+ doanh nghiệp",
    participantsEn: "100+ enterprises",
    description: "Khám phá những hoạt động mới nhất trong việc thúc đẩy văn hóa đọc và phát triển ngành xuất bản...",
    descriptionEn: "Discover the latest activities in promoting reading culture and developing the publishing industry...",
    detailContent: "Khóa đào tạo kỹ năng xuất bản cho doanh nghiệp cung cấp kiến thức toàn diện về quy trình xuất bản từ khâu biên tập, thiết kế đến phân phối và marketing. Các chuyên gia hàng đầu trong ngành sẽ chia sẻ kinh nghiệm thực tế, xu hướng công nghệ mới trong xuất bản số, và các chiến lược kinh doanh hiệu quả.\n\nNội dung đào tạo:\n• Quy trình xuất bản từ A-Z\n• Quản lý dự án xuất bản chuyên nghiệp\n• Xây dựng thương hiệu sách hiệu quả\n• Phát triển kênh bán hàng đa dạng\n• Xu hướng xuất bản số và công nghệ mới\n• Chiến lược marketing sách thành công\n\nKhóa học bao gồm các workshop thực hành, case study từ các doanh nghiệp thành công và cơ hội networking với các chuyên gia trong ngành. Đây là cơ hội tuyệt vời để các doanh nghiệp nâng cao năng lực cạnh tranh trong ngành xuất bản.",
    detailContentEn: "The Publishing Skills Training for Enterprises provides comprehensive knowledge about the publishing process from editing, design to distribution and marketing. Leading experts in the industry will share practical experience, new technology trends in digital publishing, and effective business strategies.\n\nTraining content:\n• Publishing process from A-Z\n• Professional publishing project management\n• Effective book brand building\n• Developing diverse sales channels\n• Digital publishing trends and new technologies\n• Successful book marketing strategies\n\nThe course includes hands-on workshops, case studies from successful businesses and networking opportunities with industry experts. This is a great opportunity for businesses to enhance their competitiveness in the publishing industry."
  },
  {
    id: 5,
    title: "Kết nối các nhà xuất bản Đông Nam Á",
    titleEn: "Southeast Asian Publishers Connection",
    image: "/images/Gap go.jpg",
    category: "Hợp tác",
    categoryEn: "Cooperation",
    date: "28/11/2024",
    gradient: "from-blue-500 to-cyan-500",
    location: "Trung tâm Hội nghị JW Marriott",
    locationEn: "JW Marriott Conference Center",
    participants: "50+ nhà xuất bản",
    participantsEn: "50+ publishers",
    description: "Khám phá những hoạt động mới nhất trong việc thúc đẩy văn hóa đọc và phát triển ngành xuất bản...",
    descriptionEn: "Discover the latest activities in promoting reading culture and developing the publishing industry...",
    detailContent: "Hội nghị Kết nối các nhà xuất bản Đông Nam Á là diễn đàn quan trọng để tăng cường hợp tác giữa các quốc gia trong khu vực. Sự kiện tập trung vào việc chia sẻ kinh nghiệm phát triển thị trường sách, hợp tác dịch thuật, và xây dựng mạng lưới phân phối xuyên biên giới.\n\nCác nội dung chính:\n• Chia sẻ kinh nghiệm phát triển thị trường sách\n• Hợp tác dịch thuật và xuất bản xuyên biên giới\n• Xây dựng mạng lưới phân phối khu vực\n• Thảo luận về thách thức chung trong ngành\n• Cơ hội phát triển công nghệ số\n• Chiến lược marketing sách quốc tế\n\nHội nghị quy tụ đại diện từ 50+ nhà xuất bản hàng đầu khu vực Đông Nam Á. Các chuyên gia sẽ thảo luận về những thách thức chung trong ngành xuất bản, cơ hội phát triển công nghệ số, và chiến lược marketing sách quốc tế. Hội nghị cũng tạo cơ hội gặp gỡ, trao đổi trực tiếp giữa các nhà xuất bản, mở ra nhiều cơ hội hợp tác kinh doanh mới.",
    detailContentEn: "The Southeast Asian Publishers Connection Conference is an important forum to strengthen cooperation between countries in the region. The event focuses on sharing experiences in book market development, translation cooperation, and building cross-border distribution networks.\n\nMain content:\n• Sharing experiences in book market development\n• Translation cooperation and cross-border publishing\n• Building regional distribution networks\n• Discussing common challenges in the industry\n• Digital technology development opportunities\n• International book marketing strategies\n\nThe conference brings together representatives from 50+ leading publishers in Southeast Asia. Experts will discuss common challenges in the publishing industry, digital technology development opportunities, and international book marketing strategies. The conference also creates opportunities for direct meetings and exchanges between publishers, opening up many new business cooperation opportunities."
  },
  {
    id: 6,
    title: "Nghiên cứu xu hướng đọc của giới trẻ",
    titleEn: "Youth Reading Trends Research",
    image: "/images/van_hoa_doc_sach.jpg",
    category: "Nghiên cứu",
    categoryEn: "Research",
    date: "25/11/2024",
    gradient: "from-purple-500 to-pink-500",
    location: "Đại học Quốc gia Hà Nội",
    locationEn: "Vietnam National University, Hanoi",
    participants: "1,000+ người trẻ được khảo sát",
    participantsEn: "1,000+ young people surveyed",
    description: "Khám phá những hoạt động mới nhất trong việc thúc đẩy văn hóa đọc và phát triển ngành xuất bản...",
    descriptionEn: "Discover the latest activities in promoting reading culture and developing the publishing industry...",
    detailContent: "Nghiên cứu xu hướng đọc của giới trẻ là dự án quan trọng nhằm hiểu rõ thói quen và sở thích đọc của thế hệ Z và Millennials. Nghiên cứu được thực hiện trên phạm vi toàn quốc với sự tham gia của các trường đại học, trung học phổ thông và các tổ chức thanh niên.\n\nPhạm vi nghiên cứu:\n• Khảo sát 1,000+ bạn trẻ từ 15-35 tuổi\n• 30 tỉnh thành trên cả nước\n• 50 trường đại học và THPT\n• Phối hợp với 20 tổ chức thanh niên\n\nKết quả nghiên cứu cho thấy sự thay đổi rõ rệt trong cách tiếp cận sách của giới trẻ, từ sách giấy truyền thống sang các định dạng số như ebook, audiobook và podcast. Nghiên cứu cũng phân tích tác động của mạng xã hội đến việc khuyến khích đọc sách và đề xuất các giải pháp để thu hút giới trẻ yêu thích đọc hơn.\n\nCác phát hiện chính sẽ được công bố trong báo cáo chi tiết và sẽ là cơ sở để xây dựng các chương trình khuyến đọc phù hợp với giới trẻ.",
    detailContentEn: "The Youth Reading Trends Research is an important project aimed at understanding the reading habits and preferences of Generation Z and Millennials. The research was conducted nationwide with the participation of universities, high schools and youth organizations.\n\nResearch scope:\n• Survey 1,000+ young people aged 15-35\n• 30 provinces and cities nationwide\n• 50 universities and high schools\n• Cooperation with 20 youth organizations\n\nThe results show a clear change in young people's approach to books, from traditional paper books to digital formats such as ebooks, audiobooks and podcasts. The research also analyzes the impact of social media on encouraging reading and proposes solutions to attract young people to love reading more.\n\nKey findings will be published in a detailed report and will be the basis for building reading promotion programs suitable for young people."
  }
]

export function getNewsById(id: number): NewsItem | undefined {
  return newsItems.find(item => item.id === id)
}

export function getAllNews(): NewsItem[] {
  return newsItems
} 