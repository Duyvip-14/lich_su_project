USE lich_su_viet_nam;

DELETE FROM NhanVat_SuKien;
DELETE FROM NhanVat;
DELETE FROM SuKien;
DELETE FROM TrieuDai;
ALTER TABLE NhanVat AUTO_INCREMENT = 1;
ALTER TABLE SuKien AUTO_INCREMENT = 1;
ALTER TABLE TrieuDai AUTO_INCREMENT = 1;

INSERT INTO TrieuDai (ten_trieu_dai, thoi_gian_ton_tai, mo_ta) VALUES
('Nhà Trần', '1225 - 1400', 'Triều đại ba lần kháng chiến chống quân Mông - Nguyên.'),
('Nhà Hậu Lê', '1428 - 1789', 'Triều đại do Lê Lợi sáng lập sau khởi nghĩa Lam Sơn.'),
('Nhà Tây Sơn', '1778 - 1802', 'Triều đại do anh em Tây Sơn lập nên.');

INSERT INTO NhanVat (ho_ten, ten_khac, ngay_sinh_ngay_mat, mo_ta, hinh_anh, nguon_tham_khao, trieu_dai_id) VALUES
('Trần Hưng Đạo', 'Trần Quốc Tuấn', '1228 - 1300', 'Danh tướng nhà Trần, chỉ huy kháng chiến chống Mông - Nguyên.', 'tran-hung-dao.jpg', 'Đại Việt sử ký toàn thư', 1),
('Lê Lợi', 'Lê Thái Tổ', '1385 - 1433', 'Lãnh tụ khởi nghĩa Lam Sơn, sáng lập nhà Hậu Lê.', 'le-loi.jpg', 'Đại Việt sử ký toàn thư', 2),
('Nguyễn Huệ', 'Quang Trung', '1753 - 1792', 'Hoàng đế Quang Trung, lãnh đạo phong trào Tây Sơn.', 'nguyen-hue.jpg', 'Đại Nam thực lục', 3);

INSERT INTO SuKien (ten_su_kien, thoi_gian, dia_diem, mo_ta, hinh_anh, nguon_tham_khao, trieu_dai_id) VALUES
('Chiến thắng Bạch Đằng', '1288', 'Sông Bạch Đằng', 'Quân dân nhà Trần đánh tan thủy quân Mông - Nguyên.', 'bach-dang-1288.jpg', 'Đại Việt sử ký toàn thư', 1),
('Khởi nghĩa Lam Sơn', '1418 - 1427', 'Thanh Hóa', 'Cuộc khởi nghĩa do Lê Lợi lãnh đạo, đánh đuổi quân Minh.', 'khoi-nghia-lam-son.jpg', 'Đại Việt sử ký toàn thư', 2),
('Chiến thắng Ngọc Hồi - Đống Đa', '1789', 'Thăng Long', 'Quân Tây Sơn đại phá quân Thanh vào dịp đầu xuân.', 'ngoc-hoi-dong-da.jpg', 'Đại Nam thực lục', 3);

INSERT INTO NhanVat_SuKien (nhan_vat_id, su_kien_id, vai_tro) VALUES
(1, 1, 'Chỉ huy kháng chiến'),
(2, 2, 'Lãnh tụ khởi nghĩa'),
(3, 3, 'Người chỉ huy chiến dịch');