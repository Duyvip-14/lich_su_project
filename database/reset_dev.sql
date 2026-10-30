-- CẢNH BÁO: file này xóa toàn bộ dữ liệu, không chạy trên database cần giữ
-- CHỈ DÙNG TRONG MÔI TRƯỜNG PHÁT TRIỂN.
-- Xóa bảng cũng xóa toàn bộ dữ liệu bên trong; chạy schema.sql rồi seed.sql sau đó.
USE lich_su_viet_nam;

DROP TABLE IF EXISTS NhanVat_SuKien;
DROP TABLE IF EXISTS NhanVat;
DROP TABLE IF EXISTS SuKien;
DROP TABLE IF EXISTS TrieuDai;
