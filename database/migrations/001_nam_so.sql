USE lich_su_viet_nam;

ALTER TABLE SuKien
  ADD COLUMN nam_bat_dau INT AFTER thoi_gian,
  ADD COLUMN nam_ket_thuc INT AFTER nam_bat_dau;

ALTER TABLE TrieuDai
  ADD COLUMN nam_bat_dau INT AFTER thoi_gian_ton_tai,
  ADD COLUMN nam_ket_thuc INT AFTER nam_bat_dau;

UPDATE SuKien SET nam_bat_dau = 1288, nam_ket_thuc = 1288 WHERE ten_su_kien = 'Chiến thắng Bạch Đằng';
UPDATE SuKien SET nam_bat_dau = 1418, nam_ket_thuc = 1427 WHERE ten_su_kien = 'Khởi nghĩa Lam Sơn';
UPDATE SuKien SET nam_bat_dau = 1789, nam_ket_thuc = 1789 WHERE ten_su_kien = 'Chiến thắng Ngọc Hồi - Đống Đa';

UPDATE TrieuDai SET nam_bat_dau = 1225, nam_ket_thuc = 1400 WHERE ten_trieu_dai = 'Nhà Trần';
UPDATE TrieuDai SET nam_bat_dau = 1428, nam_ket_thuc = 1789 WHERE ten_trieu_dai = 'Nhà Hậu Lê';
UPDATE TrieuDai SET nam_bat_dau = 1778, nam_ket_thuc = 1802 WHERE ten_trieu_dai = 'Nhà Tây Sơn';