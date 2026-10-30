# Dòng Sử Việt — frontend

Chạy bằng Node.js 20 trở lên. Cài dependency lần đầu; lệnh dev tự build mô-đun trống 3D:

```sh
cd frontend
npm install
npm run dev
```

Mở http://localhost:5173. Trên PowerShell nếu npm.ps1 bị chặn, dùng `npm.cmd run dev`.

## Bản đầu

- Timeline dọc: thời kỳ → triều đại/giai đoạn → sự kiện. Mỗi cấp chỉ mở một mục.
- Sự kiện lớn có minh họa và tóm tắt, sự kiện nhỏ thu gọn; nút đọc sơ lược và trang chi tiết riêng.
- Tìm kiếm không dấu theo sự kiện, nhân vật, địa điểm và năm; trang nhân vật có sự kiện liên quan.
- Kẹp sách, tiếp tục đúng vị trí cuộn và trạng thái mở của timeline qua localStorage.
- Trống đồng Three.js: kéo xoay, cuộn/chụm để thu phóng, tạm dừng xoay và đặt lại góc nhìn. Tắt tự xoay khi yêu cầu giảm chuyển động; giải phóng tài nguyên khi rời trang. Nếu WebGL không hoạt động, dùng lại mô phỏng CSS. Đây là mô hình cách điệu, chưa phải bản số hóa hiện vật khảo cổ.
- Bố cục điện thoại và máy tính, điều hướng bàn phím, reduced motion.

## Dữ liệu và giới hạn

Frontend hiện dùng bộ nội dung chọn lọc ở `src/data.js` để duyệt và đánh giá giao diện độc lập với MySQL. Những phần chưa biên soạn được ghi rõ trong trang chi tiết. Tranh SVG là minh họa cách điệu, không phải tư liệu lịch sử; ảnh tổng hợp các thời kỳ và tài sản hình ảnh chính thức sẽ được bổ sung sau.

Máy chủ có proxy `/api/*` đến `http://localhost:5000` (đổi bằng biến môi trường `API_URL`). Chưa kết nối bộ dữ liệu giao diện với API vì API hiện chưa cung cấp phân kỳ lớn, mức độ quan trọng, nội dung theo mục và nguồn chú thích tương ứng. Không sửa backend hoặc database trong thay đổi này.

Đăng nhập và đồng bộ tài khoản chưa được triển khai: backend chưa có authentication. Nút đăng nhập giải thích rõ trạng thái này, không giả lập tài khoản. Kẹp sách chỉ được lưu trong trình duyệt hiện tại; xóa dữ liệu trình duyệt sẽ xóa kẹp sách.

Font Google có font hệ thống dự phòng khi mất mạng. Three.js được cài qua npm và đóng gói cục bộ bằng esbuild; hoa văn trống được vẽ bằng canvas, không cần CDN hay ảnh ngoài.

Chạy `npm run build` để tạo `dist/drum.js` sau khi sửa `src/drum.js`. Máy chủ Node hiện tại phục vụ trực tiếp bundle này.

```sh
npm test
```
