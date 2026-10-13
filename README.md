# Ebook Lật Trang - Sách Điện Tử 3D Trực Tuyến & Ngoại Tuyến

Ứng dụng web đọc file PDF dưới dạng sách giấy với hiệu ứng lật trang 3D chân thực, mô phỏng âm thanh lật giấy tự nhiên, tùy biến màu sắc và hỗ trợ xuất gói sách lật ngoại tuyến (Offline ZIP).

---

## 🌟 Tính Năng Nổi Bật

1. **Xử lý PDF 100% trong trình duyệt**:
   - Không tải nội dung sách lên bất kỳ máy chủ nào (bảo mật và riêng tư 100%).
   - Kéo thả file PDF hoặc chọn từ thiết bị (hỗ trợ tối đa 50MB).
   - Render hình ảnh độ phân giải cao, chữ rõ nét trên mọi màn hình.

2. **Hiệu ứng lật trang 3D & Âm thanh**:
   - Hiển thị 2 trang đôi (máy tính) hoặc 1 trang đơn (điện thoại).
   - Âm thanh lật giấy sinh động được tổng hợp trực tiếp bằng Web Audio API (không cần file âm thanh ngoài).
   - Hỗ trợ phím mũi tên, chuột nhấp mép sách, chạm vuốt cảm ứng.

3. **Hai nút tải về riêng biệt**:
   - **“Tải PDF gốc”**: Tải file PDF ban đầu để in ấn hoặc lưu trữ.
   - **“Tải sách lật về”**: Xuất trọn gói file `.zip` chứa file `index.html`, file PDF và hình ảnh các trang. Khi giải nén, người dùng chỉ cần nhấp đúp vào `index.html` là đọc sách lật 3D ngoại tuyến mà **không cần mạng Internet**.

4. **Tùy biến giao diện**:
   - 8 bảng màu phối sẵn (Nâu giấy cổ điển, Xanh ngọc dịu, Xanh lá học tập, Tím lavender, v.v.).
   - Bộ chọn màu tùy ý và tự động lưu cấu hình (`localStorage`).

---

## 🚀 1. Hướng Dẫn Chạy Thử Ứng Dụng (Local Development)

Yêu cầu: Đã cài đặt **Node.js** (phiên bản 18 trở lên).

```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi động máy chủ phát triển
npm run dev

# 3. Mở trình duyệt và truy cập:
# http://localhost:3000
```

Để kiểm tra bản build đóng gói:
```bash
npm run build
npm run preview
```

---

## 📦 2. Đồng Bộ Dự Án Với GitHub Từ Google AI Studio

Bạn có hai cách để lấy mã nguồn dự án:

### Cách A: Kết nối trực tiếp GitHub trong AI Studio
1. Trong giao diện Google AI Studio, nhìn vào góc trên bên phải thanh công cụ.
2. Chọn biểu tượng **GitHub** hoặc nút **Export to GitHub**.
3. Chọn tài khoản GitHub của bạn và đặt tên Repository (ví dụ: `ebook-lat-trang`).
4. Nhấn **Create Repository / Push** để đẩy toàn bộ mã nguồn lên GitHub.

### Cách B: Tải mã nguồn về máy rồi đẩy lên GitHub
1. Tải toàn bộ mã nguồn dự án về máy tính.
2. Mở cửa sổ dòng lệnh (Terminal / Command Prompt) tại thư mục dự án và chạy:
```bash
git init
git add .
git commit -m "Khoi tao du an Ebook Lat Trang"
git branch -M main
git remote add origin https://github.com/[TEN_TAI_KHOAN_CUA_BAN]/ebook-lat-trang.git
git push -u origin main
```

---

## ⚡ 3. Triển Khai Lên Vercel (Từng Bước)

Dự án đã được cấu hình sẵn file `vercel.json` tương thích 100% với nền tảng Vercel:

1. **Đăng nhập vào Vercel**: Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub của bạn.
2. **Thêm dự án mới**:
   - Nhấn nút **“Add New...”** -> chọn **“Project”**.
   - Tìm kho lưu trữ `ebook-lat-trang` vừa tải lên và nhấn **“Import”**.
3. **Cấu hình dự án (Project Configuration)**:
   - **Framework Preset**: Vercel sẽ tự động nhận diện là **Vite**.
   - **Root Directory**: Để mặc định `./`.
   - **Build Command**: `npm run build` (mặc định).
   - **Output Directory**: `dist` (mặc định).
   - **Environment Variables**: Không cần thiết lập thêm bất kỳ biến môi trường hay API key nào!
4. **Triển khai**:
   - Nhấn nút **“Deploy”**.
   - Chờ Vercel hoàn tất quá trình build (khoảng 30-45 giây).
   - Khi màn hình hiển thị lời chúc mừng **Congratulations!**, bạn sẽ nhận được đường dẫn trang web công khai (ví dụ: `https://ebook-lat-trang.vercel.app`).

---

## 🔍 4. Kiểm Tra Ứng Dụng Sau Khi Có Đường Dẫn Vercel

Sau khi triển khai thành công lên Vercel, hãy mở liên kết web và kiểm tra các chức năng:

1. **Thử nghiệm tải PDF**:
   - Kéo thả hoặc tải một file PDF từ máy tính của bạn vào app.
   - Kiểm tra các trang sách hiển thị rõ ràng và hiệu ứng lật trang 3D hoạt động mượt mà.
   - Thử nghiệm trên cả máy tính và điện thoại thông minh.
2. **Thử nghiệm chức năng “Link App Vercel”**:
   - Bấm nút **“Link App Vercel”** trên thanh công cụ hoặc đầu trang.
   - Hộp thoại chia sẻ sẽ mở ra với đường dẫn web app trực tiếp.
   - Bấm **“Sao chép”** để gửi link cho bạn bè, học sinh, phụ huynh đọc ngay trên web Vercel mà không cần tải hay cài đặt bất kỳ phần mềm nào.
   - Quét mã **QR Code** bằng camera điện thoại để mở ngay sách lật trên di động.
   - Bấm **“Tải .url”**: Tải file lối tắt Windows (1 KB), nhấp đúp là tự động mở trình duyệt tới sách lật trên Vercel.
3. **Thử nghiệm đọc sách mẫu**:
   - Nhấp vào nút đọc thử sách mẫu có sẵn để trải nghiệm ngay.
4. **Thử nghiệm nút “Tải PDF gốc”**:
   - Bấm nút “Tải PDF gốc” trên thanh công cụ để tải lại file PDF ban đầu.
5. **Thử nghiệm nút “Tải sách lật về” (Gói ZIP)**:
   - Bấm nút “Tải sách lật về”, thanh tiến trình nén file ZIP sẽ chạy từ 0% đến 100%.
   - Trình duyệt sẽ tải về file `[Ten_Sach]_Sach_Lat_3D.zip`.
   - **Giải nén file ZIP** trên máy tính:
     + Nhấp đúp vào file `index.html`.
     + Ngắt kết nối Internet (chuyển sang chế độ máy bay) để kiểm tra.
     + Bạn sẽ thấy sách vẫn lật trang 3D, vẫn có âm thanh, vẫn phóng to thu nhỏ và đổi màu bình thường!
