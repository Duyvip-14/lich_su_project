CREATE DATABASE IF NOT EXISTS lich_su_viet_nam CHARACTER SET utf8mb4;
USE lich_su_viet_nam;

CREATE TABLE IF NOT EXISTS TrieuDai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_trieu_dai VARCHAR(255) NOT NULL,
    thoi_gian_ton_tai VARCHAR(100),
    mo_ta TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS NhanVat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ho_ten VARCHAR(255) NOT NULL,
    ten_khac VARCHAR(255),
    ngay_sinh_ngay_mat VARCHAR(100),
    mo_ta TEXT,
    hinh_anh VARCHAR(255),
    nguon_tham_khao VARCHAR(255),
    trieu_dai_id INT,
    CONSTRAINT fk_nhanvat_trieudai
        FOREIGN KEY (trieu_dai_id) REFERENCES TrieuDai(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS SuKien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_su_kien VARCHAR(255) NOT NULL,
    thoi_gian VARCHAR(100),
    dia_diem VARCHAR(255),
    mo_ta TEXT,
    hinh_anh VARCHAR(255),
    nguon_tham_khao VARCHAR(255),
    trieu_dai_id INT,
    CONSTRAINT fk_sukien_trieudai
        FOREIGN KEY (trieu_dai_id) REFERENCES TrieuDai(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS NhanVat_SuKien (
    nhan_vat_id INT,
    su_kien_id INT,
    vai_tro VARCHAR(255),
    PRIMARY KEY (nhan_vat_id, su_kien_id),
    CONSTRAINT fk_nvsk_nhanvat
        FOREIGN KEY (nhan_vat_id) REFERENCES NhanVat(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_nvsk_sukien
        FOREIGN KEY (su_kien_id) REFERENCES SuKien(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
