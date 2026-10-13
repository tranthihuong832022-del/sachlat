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
    description: 'Sách giáo khoa mẫu 8 trang với hình ảnh minh họa sinh động, câu hỏi tư duy và bài học đạo đức.',
    tag: 'Sách giáo dục mẫu',
    coverAccent: '#166534',
  },
  {
    id: 'sample_pedagogy',
    title: 'Sổ Tay Sư Phạm: Đọc Sách Tích Cực',
    subtitle: 'Cẩm nang phương pháp phát triển văn hóa đọc học đường',
    author: 'Viện Nghiên Cứu Giáo Dục Đổi Mới',
    totalPages: 6,
    description: 'Tài liệu hướng dẫn 6 trang dành cho giáo viên và phụ huynh rèn luyện kỹ năng đọc hiểu sâu.',
    tag: 'Tài liệu sư phạm',
    coverAccent: '#1E3A8A',
  },
];

/**
 * Generates rendered page images for a sample book dynamically using HTML5 Canvas
 */
export function generateSampleBookPages(bookId: string): RenderedPage[] {
  const width = 800;
  const height = 1130; // standard A4 aspect ratio (1 : 1.414)
  const pages: RenderedPage[] = [];

  if (bookId === 'sample_pedagogy') {
    return generatePedagogyPages(width, height);
  }
  return generateNaturePages(width, height);
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
