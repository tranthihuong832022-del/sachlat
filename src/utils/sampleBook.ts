import { RenderedPage } from './pdfLoader';

/**
 * Creates high-resolution, beautifully crafted canvas pages
 * for the built-in sample books so users can experience the realistic
 * flipbook immediately without uploading anything.
 */

export interface SampleBookMeta {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  totalPages: number;
  description: string;
  tag: string;
  coverAccent: string;
}

export const SAMPLE_BOOKS: SampleBookMeta[] = [
  {
    id: 'sample_nature',
    title: 'Hành Trình Tri Thức Xanh',
    subtitle: 'Khám phá thế giới tự nhiên và bảo vệ môi trường sống',
    author: 'Nhà xuất bản Giáo Dục & Môi Trường',
    totalPages: 8,
    description: 'Sách giáo khoa mẫu 8 trang khổ đứng (Portrait) với hình ảnh minh họa sinh động, bài học đạo đức.',
    tag: 'Khổ đứng (Portrait)',
    coverAccent: '#166534',
  },
  {
    id: 'sample_slides',
    title: 'Bài Giảng Điện Tử: Hệ Sinh Thái & Đa Dạng Sinh Học',
    subtitle: 'Giáo án điện tử slide trình chiếu khổ ngang trực quan',
    author: 'Tổ Chuyên Môn Sinh Học Thực Nghiệm',
    totalPages: 6,
    description: 'Tài liệu giáo án mẫu khổ ngang (Landscape - tỉ lệ 16:10) chuyên dùng cho máy chiếu, màn hình tivi và trình chiếu lớp học.',
    tag: 'Khổ ngang (Landscape)',
    coverAccent: '#D97706',
  },
  {
    id: 'sample_pedagogy',
    title: 'Sổ Tay Sư Phạm: Đọc Sách Tích Cực',
    subtitle: 'Cẩm nang phương pháp phát triển văn hóa đọc học đường',
    author: 'Viện Nghiên Cứu Giáo Dục Đổi Mới',
    totalPages: 6,
    description: 'Tài liệu hướng dẫn 6 trang khổ đứng dành cho giáo viên và phụ huynh rèn luyện kỹ năng đọc hiểu sâu.',
    tag: 'Khổ đứng (Portrait)',
    coverAccent: '#1E3A8A',
  },
];

export const SAMPLE_BOOK_TEXTS: Record<string, string[]> = {
  sample_nature: [
    'Hành Trình Tri Thức Xanh. Khám phá thế giới diệu kỳ và bảo tồn thiên nhiên. Bộ sách tri thức và cuộc sống, Tập một. Dành cho giáo viên và học sinh. Nhà xuất bản Giáo Dục Việt Nam.',
    'Lời Nói Đầu và Mục Lục. Trái Đất là ngôi nhà chung của muôn loài, mang trong mình vẻ đẹp kỳ vĩ và sự sống nhiệm màu. Cuốn sách giúp bạn khám phá các hệ sinh thái từ rừng nhiệt đới bạt ngàn đến đại dương sâu thẳm. Mục lục: Chương 1: Rừng Xanh Lá Phổi Của Trái Đất. Chương 2: Đại Dương Và Nguồn Sống Bất Tận. Chương 3: Hành Động Xanh Vì Tương Lai.',
    'Chương 1: Rừng Xanh - Lá Phổi Của Trái Đất. Rừng nhiệt đới lưu trữ hơn 250 tỷ tấn carbon, hấp thụ khí CO2 và cung cấp khí oxy trong lành cho toàn nhân loại. Mỗi hecta rừng là một kho tàng sinh thái vô giá với hàng ngàn loài thực vật và động vật quý hiếm cùng sinh sống chan hòa.',
    'Khám Phá Các Tầng Tán Của Rừng Nhiệt Đới. Tầng vượt tán là nơi những cây cổ thụ cao vút trên 40 mét đón ánh nắng mặt trời rực rỡ. Tầng tán chính tạo thành mái vòm xanh che phủ. Tầng dưới tán và tầng thảm tươi là nơi sinh sôi của các loài hoa lan, dương xỉ và côn trùng phong phú.',
    'Chương 2: Đại Dương Và Nguồn Sống Bất Tận. Đại dương bao phủ hơn 70% bề mặt Trái Đất, sản sinh hơn một nửa lượng oxy trong khí quyển và điều hòa khí hậu toàn cầu. Rạn san hô Nha Trang là ngôi nhà chung của hơn 40% sinh vật biển, nhưng đang đối mặt với nguy cơ biến đổi khí hậu.',
    'Các Sinh Vật Độc Đáo Dưới Đáy Biển Sâu. Từ loài cá voi xanh khổng lồ đến các loài sinh vật phù du siêu nhỏ, mỗi mắt xích sinh thái đều đóng vai trò then chốt trong chuỗi thức ăn biển cả. Bảo vệ đại dương khỏi rác thải nhựa là trách nhiệm cấp bách của mỗi công dân toàn cầu.',
    'Chương 3: Hành Động Xanh Vì Một Ngày Mai Tươi Đẹp. Mỗi hành động nhỏ hôm nay đều góp phần gieo mầm cho tương lai: Tiết kiệm điện nước, trồng thêm cây xanh quanh trường lớp, sử dụng vật liệu tái chế và lan tỏa lối sống xanh đến bạn bè và gia đình.',
    'Lời Kết: Trái Đất Trong Tay Chúng Ta. Cảm ơn bạn đã đồng hành cùng cuốn sách. Hãy cùng nhau bảo vệ hành tinh xanh của chúng ta ngày càng tươi đẹp và tràn đầy sức sống. Chúc bạn có những trải nghiệm đọc sách tuyệt vời!'
  ],
  sample_slides: [
    'Bài Giảng Điện Tử: Hệ Sinh Thái & Đa Dạng Sinh Học. Tổ chuyên môn Sinh học thực nghiệm. Chuyên đề học tập trực quan trên nền tảng số hóa.',
    'Mục Tiêu Bài Học Và Cấu Trúc Chuyên Đề. Thứ nhất: Nhận biết các thành phần cơ bản của hệ sinh thái. Thứ hai: Hiểu rõ chuỗi thức ăn và dòng năng lượng. Thứ ba: Đề xuất các giải pháp thực tiễn bảo tồn thiên nhiên.',
    'Cấu Trúc Tầng Tán Rừng Nhiệt Đới. Tầng vượt tán đón trọn ánh sáng mặt trời. Tầng tán chính tạo mái che dày đặc. Tầng dưới tán và tầng mặt đất phân giải chất hữu cơ duy trì chu trình tuần hoàn dinh dưỡng.',
    'Chuỗi Thức Ăn Và Lưới Dinh Dưỡng Trong Tự Nhiên. Sinh vật sản xuất là cỏ cây và thực vật xanh quang hợp. Sinh vật tiêu thụ bậc một gồm động vật ăn cỏ. Sinh vật tiêu thụ bậc hai là động vật ăn thịt, và vi sinh vật phân giải khép kín chu trình.',
    'Thực Trạng Đa Dạng Sinh Học Và Nguy Cơ Suy Giảm. Mất sinh cảnh do ô nhiễm và khai thác quá mức. Trách nhiệm của học sinh và cộng đồng: Lan tỏa thông điệp xanh và tham gia trồng rừng phủ xanh đất trống.',
    'Tổng Kết Bài Học & Câu Hỏi Tư Duy. Hãy vẽ sơ đồ tư duy tóm tắt lưới thức ăn tại địa phương em. Cảm ơn các em học sinh đã chú ý lắng nghe bài giảng!'
  ],
  sample_pedagogy: [
    'Sổ Tay Sư Phạm: Đọc Sách Tích Cực. Cẩm nang phương pháp phát triển văn hóa đọc học đường. Viện Nghiên Cứu Giáo Dục Đổi Mới.',
    'Mục Tiêu Và Tầm Nhìn Giáo Dục. Đọc sách không chỉ là tiếp thu kiến thức mà là hành trình rèn luyện tư duy phản biện, nuôi dưỡng tâm hồn và đánh thức lòng trắc ẩn trong mỗi đứa trẻ.',
    'Phương Pháp 1: Giờ Đọc Yên Lặng Hàng Ngày. Dành 15 phút đầu mỗi ngày để học sinh tự do chọn cuốn sách yêu thích và chìm đắm trong thế giới ngôn từ không bị ngắt quãng.',
    'Phương Pháp 2: Câu Lạc Bộ Sách Và Thảo Luận Nhóm. Tạo không gian an toàn để học sinh bày tỏ quan điểm, đặt câu hỏi cho tác giả và chia sẻ bài học rút ra từ tác phẩm.',
    'Đánh Giá Và Ghi Nhận Sự Tiến Bộ. Khuyến khích bằng nhật ký đọc sách, sơ đồ tư duy và huy hiệu người đọc tích cực thay vì chỉ chấm điểm hình thức.',
    'Thông Điệp Cuối: Mỗi Trang Sách Là Một Cánh Cửa Mở Ra Tương Lai. Chúc các thầy cô và các bậc phụ huynh luôn tìm thấy niềm vui trên hành trình truyền cảm hứng đọc sách.'
  ]
};

/**
 * Generates rendered page images for a sample book dynamically using HTML5 Canvas
 */
export function generateSampleBookPages(bookId: string): RenderedPage[] {
  let pages: RenderedPage[] = [];

  if (bookId === 'sample_slides') {
    // Landscape presentation slide format: 1200 x 750 (aspectRatio = 1.6)
    pages = generateSlidesPages(1200, 750);
  } else if (bookId === 'sample_pedagogy') {
    // Portrait standard A4 format: 800 x 1130 (aspectRatio = 0.707)
    pages = generatePedagogyPages(800, 1130);
  } else {
    // Portrait standard A4 format: 800 x 1130 (aspectRatio = 0.707)
    pages = generateNaturePages(800, 1130);
  }

  const textList = SAMPLE_BOOK_TEXTS[bookId] || SAMPLE_BOOK_TEXTS.sample_nature || [];
  return pages.map((page, index) => ({
    ...page,
    textContent: textList[index] || `Trang ${page.pageNumber}`,
  }));
}

function createBaseCanvas(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false })!;
  return { canvas, ctx };
}

function generateNaturePages(width: number, height: number): RenderedPage[] {
  const pages: RenderedPage[] = [];

  // 1. Cover
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    // Dark Emerald gradient cover
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#064E3B');
    grad.addColorStop(0.5, '#047857');
    grad.addColorStop(1, '#065F46');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Ornate gold border
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    ctx.strokeStyle = 'rgba(253, 230, 138, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(46, 46, width - 92, height - 92);

    // Header Tag
    ctx.fillStyle = '#FDE68A';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BỘ SÁCH TRI THỨC VÀ CUỘC SỐNG • TẬP I', width / 2, 120);

    // Center Illustration Circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, 380, 180, 0, Math.PI * 2);
    ctx.fillStyle = '#ECFDF5';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FDE68A';
    ctx.stroke();
    ctx.clip();

    // Inside circle art: Earth, trees, sun
    const sunGrad = ctx.createRadialGradient(width / 2 + 80, 300, 10, width / 2 + 80, 300, 70);
    sunGrad.addColorStop(0, '#F59E0B');
    sunGrad.addColorStop(1, '#FEF3C7');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(width / 2 + 80, 300, 50, 0, Math.PI * 2);
    ctx.fill();

    // Hills
    ctx.fillStyle = '#A7F3D0';
    ctx.beginPath();
    ctx.arc(width / 2 - 60, 460, 140, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#34D399';
    ctx.beginPath();
    ctx.arc(width / 2 + 60, 470, 160, 0, Math.PI * 2);
    ctx.fill();

    // Tree silhouettes
    drawTree(ctx, width / 2 - 40, 420, 70, '#065F46');
    drawTree(ctx, width / 2 + 30, 400, 90, '#047857');
    drawTree(ctx, width / 2 + 90, 430, 60, '#065F46');
    ctx.restore();

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('HÀNH TRÌNH', width / 2, 640);
    ctx.fillText('TRI THỨC XANH', width / 2, 700);

    // Subtitle
    ctx.fillStyle = '#D1FAE5';
    ctx.font = '19px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Khám phá thế giới diệu kỳ & Bảo tồn thiên nhiên', width / 2, 760);

    // Divider
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 90, 800);
    ctx.lineTo(width / 2 + 90, 800);
    ctx.stroke();

    // Author
    ctx.fillStyle = '#FDE68A';
    ctx.font = '600 17px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DÀNH CHO GIÁO VIÊN VÀ HỌC SINH', width / 2, 850);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('NHÀ XUẤT BẢN GIÁO DỤC VIỆT NAM • 2026', width / 2, 1020);

    pages.push({
      pageNumber: 1,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // 2. Page 2 - Foreword & Table of contents
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    drawPaperBackground(ctx, width, height, 2);

    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 30px "Playfair Display", serif';
    ctx.textAlign = 'left';
    ctx.fillText('Lời Mở Đầu', 70, 110);

    // Hairline divider
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 130);
    ctx.lineTo(width - 70, 130);
    ctx.stroke();

    ctx.fillStyle = '#374151';
    ctx.font = '16px/1.8 "Lora", Georgia, serif';
    const introText = [
      '“Thiên nhiên là người thầy vĩ đại nhất của nhân loại.',
      'Mỗi nhánh cây, giọt sương, cánh bướm đều mang trong',
      'mình những định luật kỳ diệu của sự sống.”',
      '',
      'Cuốn sách này được biên soạn nhằm mang đến cho quý thầy',
      'cô giáo và các em học sinh một góc nhìn tươi mới, trực quan',
      'về bảo vệ rừng, đại dương và môi trường sống xung quanh ta.',
      'Hãy lật từng trang sách để bước vào chuyến du hành bất tận!',
    ];
    let y = 175;
    for (const line of introText) {
      ctx.fillText(line, 70, y);
      y += 28;
    }

    // Table of contents box
    ctx.fillStyle = '#F0FDF4';
    ctx.fillRect(70, 440, width - 140, 480);
    ctx.strokeStyle = '#BBF7D0';
    ctx.strokeRect(70, 440, width - 140, 480);

    ctx.fillStyle = '#047857';
    ctx.font = 'bold 22px "Playfair Display", serif';
    ctx.fillText('MỤC LỤC TỔNG QUAN', 100, 490);

    const toc = [
      { num: '01', title: 'Lời mở đầu & Ý nghĩa sự sống', page: 'Trang 2' },
      { num: '02', title: 'Rừng xanh - Lá phổi của Trái Đất', page: 'Trang 3' },
      { num: '03', title: 'Vương quốc của muôn loài linh thú', page: 'Trang 4' },
      { num: '04', title: 'Đại dương sâu thẳm & San hô', page: 'Trang 5' },
      { num: '05', title: 'Hành động nhỏ của học sinh', page: 'Trang 6' },
      { num: '06', title: 'Câu hỏi thảo luận & Ghi nhớ', page: 'Trang 7' },
      { num: '07', title: 'Thông điệp tương lai xanh', page: 'Trang 8' },
    ];

    let tocy = 540;
    for (const item of toc) {
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(item.num, 100, tocy);

      ctx.fillStyle = '#1F2937';
      ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(item.title, 140, tocy);

      ctx.fillStyle = '#6B7280';
      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(item.page, width - 100, tocy);
      ctx.textAlign = 'left';

      // dotted line
      ctx.strokeStyle = '#E5E7EB';
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(390, tocy - 4);
      ctx.lineTo(width - 160, tocy - 4);
      ctx.stroke();
      ctx.setLineDash([]);

      tocy += 48;
    }

    pages.push({
      pageNumber: 2,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // 3. Page 3 - Forest & Ecosystem
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    drawPaperBackground(ctx, width, height, 3);

    // Chapter Tag
    ctx.fillStyle = '#059669';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CHƯƠNG I • SINH QUYỂN TRÊN CẠN', 70, 95);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 32px "Playfair Display", serif';
    ctx.fillText('Rừng Xanh: Lá Phổi Xanh', 70, 140);

    // Illustration container
    ctx.fillStyle = '#ECFDF5';
    ctx.fillRect(70, 170, width - 140, 260);
    ctx.strokeStyle = '#A7F3D0';
    ctx.strokeRect(70, 170, width - 140, 260);

    // Draw stylized forest scenery
    ctx.save();
    ctx.beginPath();
    ctx.rect(70, 170, width - 140, 260);
    ctx.clip();
    const fgrad = ctx.createLinearGradient(70, 170, 70, 430);
    fgrad.addColorStop(0, '#D1FAE5');
    fgrad.addColorStop(1, '#A7F3D0');
    ctx.fillStyle = fgrad;
    ctx.fillRect(70, 170, width - 140, 260);

    // Sun rays
    ctx.fillStyle = 'rgba(254, 243, 199, 0.4)';
    ctx.beginPath();
    ctx.moveTo(width / 2, 170);
    ctx.lineTo(100, 430);
    ctx.lineTo(250, 430);
    ctx.closePath();
    ctx.fill();

    drawTree(ctx, 150, 420, 180, '#065F46');
    drawTree(ctx, 280, 430, 220, '#047857');
    drawTree(ctx, 420, 420, 190, '#064E3B');
    drawTree(ctx, 560, 435, 230, '#047857');
    drawTree(ctx, 680, 425, 170, '#065F46');
    ctx.restore();

    ctx.fillStyle = '#4B5563';
    ctx.font = 'italic 13px "Lora", serif';
    ctx.fillText('Hình 1.1: Quá trình quang hợp của thảm thực vật rừng nguyên sinh nhiệt đới', 70, 455);

    // Body text
    ctx.fillStyle = '#1F2937';
    ctx.font = '16px/1.85 "Lora", Georgia, serif';
    const p1 = [
      'Rừng chiếm khoảng 31% diện tích đất liền của hành tinh chúng ta.',
      'Mỗi năm, các cánh rừng nhiệt đới hấp thụ hàng tỷ tấn khí CO2 và',
      'nhả ra dưỡng khí O2 nuôi dưỡng sự sống muôn loài.',
      '',
      'Khi chúng ta bảo vệ một cây cổ thụ, ta không chỉ giữ lại một thân cây,',
      'mà còn bảo vệ cả một mạng lưới cộng sinh: hàng trăm loài chim,',
      'côn trùng, nấm và vi sinh vật đất màu mỡ dưới rễ cây.',
    ];
    let py = 500;
    for (const l of p1) {
      ctx.fillText(l, 70, py);
      py += 27;
    }

    // Teacher note highlight box
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(70, 730, width - 140, 160);
    ctx.strokeStyle = '#FCD34D';
    ctx.strokeRect(70, 730, width - 140, 160);

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('GỢI Ý HOẠT ĐỘNG DÀNH CHO THẦY CÔ:', 95, 770);

    ctx.fillStyle = '#78350F';
    ctx.font = '15px/1.7 "Plus Jakarta Sans", sans-serif';
    ctx.fillText('• Cho học sinh quan sát một chiếc lá thật dưới ánh sáng mặt trời.', 95, 805);
    ctx.fillText('• Đố vui: Một cây xanh trưởng thành tạo đủ oxy cho bao nhiêu người?', 95, 835);
    ctx.fillText('• Hướng dẫn học sinh lập nhật ký trồng một mầm cây xanh tại lớp.', 95, 865);

    pages.push({
      pageNumber: 3,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // 4. Page 4 - Wildlife
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    drawPaperBackground(ctx, width, height, 4);

    ctx.fillStyle = '#059669';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CHƯƠNG I • SINH QUYỂN TRÊN CẠN (TIẾP THEO)', 70, 95);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 30px "Playfair Display", serif';
    ctx.fillText('Vương Quốc Của Muôn Loài', 70, 140);

    // 2-column layout cards
    drawCard(ctx, 70, 180, (width - 160) / 2, 280, 'Loài Vượn Đen Má Trắng', 'Biểu tượng rừng nhiệt đới Việt Nam', '#065F46');
    drawCard(ctx, 70 + (width - 160) / 2 + 20, 180, (width - 160) / 2, 280, 'Loài Sao La Quý Hiếm', 'Kỳ lân châu Á giữa đại ngàn Trường Sơn', '#047857');

    ctx.fillStyle = '#1F2937';
    ctx.font = '16px/1.8 "Lora", Georgia, serif';
    const lines4 = [
      'Sự đa dạng sinh học là chìa khóa giữ cân bằng sinh thái. Chuỗi thức ăn',
      'liên kết chặt chẽ từ loài thực vật nhỏ bé đến các động vật ăn cỏ và',
      'động vật săn mồi đầu bảng.',
      '',
      'Khi một loài biến mất, mắt xích sinh thái bị đứt gãy, dẫn đến nguy cơ',
      'suy thoái nguồn nước ngầm, xói mòn đất đai và biến đổi khí hậu.',
    ];
    let ly = 510;
    for (const l of lines4) {
      ctx.fillText(l, 70, ly);
      ly += 28;
    }

    // Did you know quote
    ctx.fillStyle = '#EFF6FF';
    ctx.fillRect(70, 710, width - 140, 160);
    ctx.strokeStyle = '#BFDBFE';
    ctx.strokeRect(70, 710, width - 140, 160);

    ctx.fillStyle = '#1E40AF';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('EM CÓ BIẾT?', 100, 750);

    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'italic 15px/1.7 "Lora", serif';
    ctx.fillText('“Tại Vườn Quốc Gia Cúc Phương và Phong Nha - Kẻ Bàng,', 100, 785);
    ctx.fillText('các nhà khoa học đã tìm thấy hơn 2.500 loài thực vật bậc cao', 100, 815);
    ctx.fillText('và hàng trăm loài chim quý hiếm đang được ghi tên vào Sách Đỏ.”', 100, 845);

    pages.push({
      pageNumber: 4,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // 5. Page 5 - Ocean
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    drawPaperBackground(ctx, width, height, 5);

    ctx.fillStyle = '#0284C7';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CHƯƠNG II • THỦY QUYỂN & ĐẠI DƯƠNG', 70, 95);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 30px "Playfair Display", serif';
    ctx.fillText('Đại Dương Sâu Thẳm & Rạn San Hô', 70, 140);

    // Ocean graphic
    ctx.fillStyle = '#E0F2FE';
    ctx.fillRect(70, 170, width - 140, 240);
    ctx.strokeStyle = '#7DD3FC';
    ctx.strokeRect(70, 170, width - 140, 240);

    // Wave illustration
    ctx.save();
    ctx.beginPath();
    ctx.rect(70, 170, width - 140, 240);
    ctx.clip();
    const ograd = ctx.createLinearGradient(70, 170, 70, 410);
    ograd.addColorStop(0, '#BAE6FD');
    ograd.addColorStop(1, '#0284C7');
    ctx.fillStyle = ograd;
    ctx.fillRect(70, 170, width - 140, 240);

    // Stylized fish & corals
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let f = 0; f < 6; f++) {
      const fx = 120 + f * 95;
      const fy = 240 + Math.sin(f) * 40;
      ctx.beginPath();
      ctx.ellipse(fx, fy, 22, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = '#4B5563';
    ctx.font = 'italic 13px "Lora", serif';
    ctx.fillText('Hình 2.1: Rạn san hô Nha Trang - Ngôi nhà của hơn 40% sinh vật biển', 70, 435);

    ctx.fillStyle = '#1F2937';
    ctx.font = '16px/1.8 "Lora", Georgia, serif';
    const lines5 = [
      'Đại dương bao phủ hơn 70% bề mặt Trái Đất và sản sinh ra hơn 50%',
      'lượng oxy cho bầu khí quyển nhờ các sinh vật phù du tí hon.',
      '',
      'Hiện nay, rác thải nhựa đại dương đang là mối đe dọa hàng đầu đối với',
      'rùa biển, cá voi và chim hải âu. Mỗi hành động giảm dùng đồ nhựa dùng',
      'một lần của em đều góp phần cứu lấy biển cả xanh tươi.',
    ];
    let oly = 480;
    for (const l of lines5) {
      ctx.fillText(l, 70, oly);
      oly += 28;
    }

    pages.push({
      pageNumber: 5,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // 6. Page 6 - Practical actions
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    drawPaperBackground(ctx, width, height, 6);

    ctx.fillStyle = '#059669';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CHƯƠNG III • HÀNH ĐỘNG HỌC ĐƯỜNG', 70, 95);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 30px "Playfair Display", serif';
    ctx.fillText('5 Việc Nhỏ Tạo Thay Đổi Lớn', 70, 140);

    const tips = [
      { step: '1', title: 'Tắt đèn và quạt khi rời khỏi lớp học', desc: 'Tiết kiệm năng lượng giúp giảm lượng than đá đốt tại các nhà máy điện.' },
      { step: '2', title: 'Mang bình nước cá nhân mỗi ngày', desc: 'Một chiếc bình inox thay thế hàng trăm chai nhựa dùng một lần mỗi năm.' },
      { step: '3', title: 'Phân loại rác tại nguồn ngay ở góc lớp', desc: 'Tách biệt rác tái chế (giấy, vỏ lon) và rác hữu cơ để dễ xử lý.' },
      { step: '4', title: 'Tận dụng giấy nháp hai mặt khi học tập', desc: 'Cứ mỗi 1 tấn giấy tiết kiệm là ta đã cứu được 17 cây xanh to lớn.' },
      { step: '5', title: 'Lan tỏa thông điệp yêu thiên nhiên', desc: 'Kể cho bạn bè và gia đình nghe những điều em vừa khám phá từ sách!' },
    ];

    let ty = 190;
    for (const tip of tips) {
      // Step badge
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(95, ty + 18, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tip.step, 95, ty + 24);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(tip.title, 130, ty + 14);

      ctx.fillStyle = '#4B5563';
      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(tip.desc, 130, ty + 38);

      ty += 80;
    }

    pages.push({
      pageNumber: 6,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // 7. Page 7 - Classroom Questions & Reflection
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    drawPaperBackground(ctx, width, height, 7);

    ctx.fillStyle = '#059669';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TỔNG KẾT BÀI HỌC', 70, 95);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 30px "Playfair Display", serif';
    ctx.fillText('Góc Thảo Luận & Ôn Tập', 70, 140);

    const questions = [
      'Câu 1: Tại sao rừng lại được ví như “lá phổi xanh” của Trái Đất?',
      'Câu 2: Kể tên 3 sinh vật biển đang bị đe dọa bởi rác thải nhựa.',
      'Câu 3: Em và lớp mình sẽ thực hiện hành động xanh nào trong tuần này?',
      'Câu 4: Hãy vẽ một bức tranh về thiên nhiên tươi đẹp em mong ước.',
    ];

    let qy = 200;
    for (const q of questions) {
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(70, qy, width - 140, 70);
      ctx.strokeStyle = '#E5E7EB';
      ctx.strokeRect(70, qy, width - 140, 70);

      ctx.fillStyle = '#1F2937';
      ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(q, 95, qy + 40);
      qy += 95;
    }

    // Teacher seal
    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 18px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText('“Mỗi trang sách mở ra là một chân trời tri thức mới.”', width / 2, 700);
    ctx.textAlign = 'left';

    pages.push({
      pageNumber: 7,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // 8. Back Cover
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#064E3B');
    grad.addColorStop(0.5, '#047857');
    grad.addColorStop(1, '#065F46');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // Summary blurb in white box
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(80, 200, width - 160, 400);

    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 22px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText('THÔNG ĐIỆP GỬI THẾ HỆ TƯƠNG LAI', width / 2, 260);

    ctx.fillStyle = '#374151';
    ctx.font = '16px/1.8 "Lora", serif';
    const blurb = [
      '“Tương lai của Trái Đất không nằm ở nơi xa xôi,',
      'mà bắt đầu từ ngay chính góc bàn học của các em,',
      'từ việc tiết kiệm từng giọt nước, từng trang giấy.',
      'Hãy là một đại sứ môi trường nhỏ bé nhưng kiên định!”',
    ];
    let by = 320;
    for (const b of blurb) {
      ctx.fillText(b, width / 2, by);
      by += 32;
    }

    // Barcode simulation
    ctx.fillStyle = '#111827';
    ctx.fillRect(width / 2 - 120, 480, 240, 50);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '11px monospace';
    ctx.fillText('ISBN 978-604-0-12345-6', width / 2, 555);

    // Footer info
    ctx.fillStyle = '#FDE68A';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('EBOOK LẬT TRANG • TRẢI NGHIỆM ĐỌC THỰC TẾ 2026', width / 2, 900);
    ctx.fillStyle = '#A7F3D0';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Ứng dụng xử lý trực tiếp trong trình duyệt • Bảo mật 100%', width / 2, 930);

    pages.push({
      pageNumber: 8,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  return pages;
}

function generatePedagogyPages(width: number, height: number): RenderedPage[] {
  const pages: RenderedPage[] = [];

  // Page 1: Cover
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#1E3A8A');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#93C5FD';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.fillStyle = '#93C5FD';
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TÀI LIỆU TẬP HUẤN SƯ PHẠM ĐỔI MỚI', width / 2, 140);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 38px "Playfair Display", serif';
    ctx.fillText('SỔ TAY SƯ PHẠM', width / 2, 380);
    ctx.font = 'bold 30px "Playfair Display", serif';
    ctx.fillStyle = '#60A5FA';
    ctx.fillText('KỸ THUẬT ĐỌC SÁCH TÍCH CỰC', width / 2, 440);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Nâng cao năng lực tự học và tư duy phản biện cho học sinh', width / 2, 520);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('VIỆN KHOA HỌC GIÁO DỤC • HÀ NỘI 2026', width / 2, 1000);

    pages.push({
      pageNumber: 1,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // Page 2 - 5: Body
  const pageTitles = [
    'Phương Pháp Đọc Tích Cực SQ3R',
    'Kỹ Thuật Đọc To Đối Thoại',
    'Nhật Ký Đọc & Sơ Đồ Tư Duy',
    'Đánh Giá Năng Lực Đọc Hiểu',
  ];

  pageTitles.forEach((title, idx) => {
    const pageNum = idx + 2;
    const { canvas, ctx } = createBaseCanvas(width, height);
    drawPaperBackground(ctx, width, height, pageNum);

    ctx.fillStyle = '#1E40AF';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`CHUYÊN ĐỀ ${pageNum - 1} • KỸ NĂNG SƯ PHẠM`, 70, 95);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px "Playfair Display", serif';
    ctx.fillText(title, 70, 140);

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 160);
    ctx.lineTo(width - 70, 160);
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.font = '16px/1.8 "Lora", serif';
    const lines = [
      `1. Mục tiêu cốt lõi: Giúp người học làm chủ văn bản và liên hệ thực tế.`,
      `2. Các bước triển khai trong 45 phút tiết học trên lớp.`,
      `3. Phân hoá theo từng đối tượng học sinh (tiểu học, THCS, THPT).`,
      `4. Bảng tiêu chí quan sát mức độ hứng thú và tiến bộ của học sinh.`,
    ];
    let y = 210;
    for (const l of lines) {
      ctx.fillText(l, 70, y);
      y += 38;
    }

    // Pedagogical tip card
    ctx.fillStyle = '#EFF6FF';
    ctx.fillRect(70, 420, width - 140, 240);
    ctx.strokeStyle = '#BFDBFE';
    ctx.strokeRect(70, 420, width - 140, 240);

    ctx.fillStyle = '#1D4ED8';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('LỜI KHUYÊN DÀNH CHO GIÁNG VIÊN / THẦY CÔ:', 95, 460);

    ctx.fillStyle = '#1E3A8A';
    ctx.font = '15px/1.8 "Plus Jakarta Sans", sans-serif';
    ctx.fillText('• Hãy luôn đặt câu hỏi mở "Tại sao em lại nghĩ nhân vật làm như vậy?"', 95, 500);
    ctx.fillText('• Khen ngợi sự liên tưởng độc đáo thay vì chỉ tìm một câu trả lời duy nhất.', 95, 540);
    ctx.fillText('• Khuyến khích học sinh dùng hình ảnh, màu sắc để tóm tắt cuốn sách.', 95, 580);

    pages.push({
      pageNumber: pageNum,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      width,
      height,
      aspectRatio: width / height,
    });
  });

  // Page 6: Back cover
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText('HÀNH TRÌNH KHAI PHÓNG TRI THỨC', width / 2, 450);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Tài liệu lưu hành nội bộ ngành Giáo dục', width / 2, 500);

    pages.push({
      pageNumber: 6,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  return pages;
}

function drawPaperBackground(ctx: CanvasRenderingContext2D, width: number, height: number, pageNum: number) {
  // Off-white book paper tone
  ctx.fillStyle = '#FDFCF7';
  ctx.fillRect(0, 0, width, height);

  // Subtle page margins
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Page number at bottom
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`- ${pageNum} -`, width / 2, height - 40);
  ctx.textAlign = 'left';
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, color: string) {
  // Trunk
  ctx.fillStyle = '#78350F';
  ctx.fillRect(x - 6, y - h * 0.35, 12, h * 0.35);

  // Foliage
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.lineTo(x - h * 0.32, y - h * 0.3);
  ctx.lineTo(x + h * 0.32, y - h * 0.3);
  ctx.closePath();
  ctx.fill();
}

function drawCard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, title: string, sub: string, color: string) {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  // Top color banner
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, 120);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, x + w / 2, y + 65);

  ctx.fillStyle = '#374151';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(sub, x + w / 2, y + 170);
  ctx.textAlign = 'left';
}

/**
 * Generates 6 landscape presentation slides (width: 1200, height: 750, ratio 1.6)
 */
function generateSlidesPages(width: number, height: number): RenderedPage[] {
  const pages: RenderedPage[] = [];

  // Slide 1: Cover Title Slide
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#1E293B');
    grad.addColorStop(0.6, '#0F172A');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative grid pattern & accents
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 60; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 60; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Badge
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.roundRect(100, 140, 260, 36, 18);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GIÁO ÁN ĐIỆN TỬ • KHỔ NGANG', 230, 163);

    // Main Title
    ctx.textAlign = 'left';
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('HỆ SINH THÁI RỪNG', 100, 260);
    ctx.fillText('& ĐA DẠNG SINH HỌC', 100, 320);

    // Subtitle
    ctx.fillStyle = '#94A3B8';
    ctx.font = '20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Chuyên đề bài giảng trực quan số hóa dành cho giáo viên và học sinh', 100, 380);

    // Presenter card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.beginPath();
    ctx.roundRect(100, 480, 500, 110, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
    ctx.stroke();

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TỔ CHUYÊN MÔN SINH HỌC & CÔNG NGHỆ', 130, 522);
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Định dạng: Khổ ngang (Landscape - 16:10 / Máy chiếu)', 130, 555);

    // Page indicator
    ctx.fillStyle = '#64748B';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Slide 1 / 6', width - 80, height - 50);

    pages.push({
      pageNumber: 1,
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // Slide 2: Objectives & Agenda
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, width, height);

    // Top banner
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, 110);
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Mục Tiêu Bài Học & Cấu Trúc Chuyên Đề', 80, 68);

    // 3 Cards layout
    const cardW = 320;
    const cardH = 460;
    const cards = [
      { num: '01', title: 'Khái Niệm Hệ Sinh Thái', desc: 'Nhận biết các nhân tố sinh thái vô sinh và hữu sinh, vai trò của thảm thực vật.', color: '#0284C7' },
      { num: '02', title: 'Chuỗi & Lưới Thức Ăn', desc: 'Phân tích dòng năng lượng từ sinh vật sản xuất tới sinh vật tiêu thụ và phân giải.', color: '#059669' },
      { num: '03', title: 'Hành Động Bảo Tồn', desc: 'Đề xuất giải pháp bảo vệ rừng, chống suy giảm đa dạng sinh học trong bối cảnh mới.', color: '#D97706' },
    ];

    cards.forEach((c, i) => {
      const cx = 80 + i * (cardW + 40);
      const cy = 160;

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(cx, cy, cardW, cardH, 16);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.roundRect(cx + 24, cy + 24, 52, 52, 12);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(c.num, cx + 50, cy + 58);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 19px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(c.title, cx + 24, cy + 125);

      ctx.fillStyle = '#475569';
      ctx.font = '15px "Plus Jakarta Sans", sans-serif';
      // wrapped text
      const words = c.desc.split(' ');
      let line = '';
      let lineY = cy + 170;
      for (const w of words) {
        const testLine = line + w + ' ';
        if (ctx.measureText(testLine).width > cardW - 48) {
          ctx.fillText(line, cx + 24, lineY);
          line = w + ' ';
          lineY += 26;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, cx + 24, lineY);
    });

    // Footer
    ctx.fillStyle = '#94A3B8';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Slide 2 / 6', width - 80, height - 40);

    pages.push({
      pageNumber: 2,
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // Slide 3: Canopy Layers
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    ctx.fillStyle = '#F0FDF4';
    ctx.fillRect(0, 0, width, height);

    // Header
    ctx.fillStyle = '#166534';
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Cấu Trúc Tầng Tán Của Rừng Mưa Nhiệt Đới', 80, 80);

    // Horizontal Layer bands
    const layers = [
      { name: '1. Tầng vượt tán (Trên 40m)', desc: 'Cây đại thụ vươn mình đón ánh sáng chói chang, chim ưng, vượn và đại bàng sinh sống.', bg: '#DCFCE7', tag: '#166534' },
      { name: '2. Tầng tán chính (25m - 40m)', desc: 'Mái vòm rậm rạp xanh mát, chiếm 70% sinh khối và sự sống của toàn bộ khu rừng.', bg: '#BBF7D0', tag: '#15803D' },
      { name: '3. Tầng dưới tán (5m - 25m)', desc: 'Không khí ẩm ướt, ánh sáng lọc mờ ảo, nơi phát triển của hoa phong lan và cây leo.', bg: '#86EFAC', tag: '#166534' },
      { name: '4. Tầng thảm tươi & Đất (0m - 5m)', desc: 'Rêu mốc, nấm, dương xỉ và côn trùng thực hiện phân giải chất hữu cơ màu mỡ.', bg: '#4ADE80', tag: '#14532D' },
    ];

    layers.forEach((l, idx) => {
      const ly = 120 + idx * 125;
      ctx.fillStyle = l.bg;
      ctx.beginPath();
      ctx.roundRect(80, ly, width - 160, 105, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(22, 101, 52, 0.2)';
      ctx.stroke();

      ctx.fillStyle = l.tag;
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(l.name, 110, ly + 40);

      ctx.fillStyle = '#1F2937';
      ctx.font = '15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(l.desc, 110, ly + 75);
    });

    ctx.fillStyle = '#166534';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Slide 3 / 6', width - 80, height - 30);

    pages.push({
      pageNumber: 3,
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // Slide 4: Food Chain Diagram
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Sơ Đồ Chuỗi Thức Ăn Và Dòng Năng Lượng', 80, 80);

    // 4 step flowchart boxes horizontally
    const steps = [
      { label: 'Năng lượng Mặt Trời', sub: 'Quang hợp', color: '#F59E0B' },
      { label: 'Sinh vật sản xuất', sub: 'Cỏ & Thực vật xanh', color: '#10B981' },
      { label: 'Sinh vật tiêu thụ', sub: 'Động vật ăn cỏ & Ăn thịt', color: '#EF4444' },
      { label: 'Sinh vật phân giải', sub: 'Nấm & Vi sinh vật', color: '#8B5CF6' },
    ];

    const boxW = 220;
    const boxH = 260;
    steps.forEach((s, i) => {
      const bx = 80 + i * (boxW + 35);
      const by = 220;

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 16);
      ctx.fill();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = s.color;
      ctx.fillRect(bx, by, boxW, 14);

      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.label, bx + boxW / 2, by + 90);

      ctx.fillStyle = '#6B7280';
      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(s.sub, bx + boxW / 2, by + 140);

      // Arrow to next box
      if (i < steps.length - 1) {
        ctx.fillStyle = '#D97706';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('➔', bx + boxW + 18, by + boxH / 2);
      }
    });

    ctx.fillStyle = '#78350F';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Slide 4 / 6', width - 80, height - 40);

    pages.push({
      pageNumber: 4,
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // Slide 5: Conservation Actions
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Các Giải Pháp Bảo Vệ & Phục Hồi Đa Dạng Sinh Học', 80, 80);

    // 2 Large Split panels
    const panelW = 490;
    const panelH = 480;

    // Left Panel: Threat
    ctx.fillStyle = '#FEF2F2';
    ctx.beginPath();
    ctx.roundRect(80, 130, panelW, panelH, 16);
    ctx.fill();
    ctx.strokeStyle = '#FECACA';
    ctx.stroke();

    ctx.fillStyle = '#991B1B';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Nguy cơ đe dọa hiện hữu', 110, 180);
    ctx.fillStyle = '#374151';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('• Chặt phá rừng và thu hẹp sinh cảnh sống tự nhiên', 110, 230);
    ctx.fillText('• Biến đổi khí hậu làm tăng nhiệt độ và khô hạn', 110, 275);
    ctx.fillText('• Ô nhiễm rác thải nhựa và hóa chất bảo vệ thực vật', 110, 320);
    ctx.fillText('• Săn bắt và buôn bán trái phép động vật hoang dã', 110, 365);

    // Right Panel: Solution
    ctx.fillStyle = '#F0FDF4';
    ctx.beginPath();
    ctx.roundRect(630, 130, panelW, panelH, 16);
    ctx.fill();
    ctx.strokeStyle = '#BBF7D0';
    ctx.stroke();

    ctx.fillStyle = '#166534';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Hành động cụ thể của chúng ta', 660, 180);
    ctx.fillStyle = '#374151';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✔ Trồng cây gây rừng tại địa phương và khuôn viên trường', 660, 230);
    ctx.fillText('✔ Phân loại rác tại nguồn, tái chế và tiết kiệm năng lượng', 660, 275);
    ctx.fillText('✔ Tham gia các hoạt động tuyên truyền bảo tồn thiên nhiên', 660, 320);
    ctx.fillText('✔ Ứng dụng công nghệ số trong học tập và nâng cao ý thức', 660, 365);

    ctx.fillStyle = '#64748B';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Slide 5 / 6', width - 80, height - 40);

    pages.push({
      pageNumber: 5,
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  // Slide 6: Summary & Review
  {
    const { canvas, ctx } = createBaseCanvas(width, height);
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(1, '#1E293B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TỔNG KẾT BÀI HỌC & CỦNG CỐ', width / 2, 220);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Mỗi cá nhân là một đại sứ bảo vệ hành tinh xanh!', width / 2, 290);
    ctx.fillText('Hãy hoàn thành sơ đồ tư duy tóm tắt nội dung bài học vào vở ghi chép.', width / 2, 330);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CẢM ƠN THẦY CÔ VÀ CÁC BẠN HỌC SINH ĐÃ THEO DÕI!', width / 2, 450);

    ctx.fillStyle = '#64748B';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Slide 6 / 6', width - 80, height - 50);

    pages.push({
      pageNumber: 6,
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      width,
      height,
      aspectRatio: width / height,
    });
  }

  return pages;
}
