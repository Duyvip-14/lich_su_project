const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// Danh sách nhân vật (kèm tên triều đại)
app.get('/api/nhan-vat', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT nv.id, nv.ho_ten, nv.ngay_sinh_ngay_mat, nv.hinh_anh,
              td.ten_trieu_dai
       FROM NhanVat nv
       LEFT JOIN TrieuDai td ON nv.trieu_dai_id = td.id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Chi tiết một nhân vật, kèm các sự kiện tham gia
app.get('/api/nhan-vat/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT nv.*, td.ten_trieu_dai
       FROM NhanVat nv
       LEFT JOIN TrieuDai td ON nv.trieu_dai_id = td.id
       WHERE nv.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhân vật' });
    }
    const [suKien] = await pool.query(
      `SELECT sk.id, sk.ten_su_kien, sk.thoi_gian, nvsk.vai_tro
       FROM NhanVat_SuKien nvsk
       JOIN SuKien sk ON nvsk.su_kien_id = sk.id
       WHERE nvsk.nhan_vat_id = ?`,
      [req.params.id]
    );
    res.json({ ...rows[0], su_kien: suKien });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Danh sách sự kiện
app.get('/api/su-kien', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT sk.id, sk.ten_su_kien, sk.thoi_gian, sk.dia_diem, sk.hinh_anh,
              td.ten_trieu_dai
       FROM SuKien sk
       LEFT JOIN TrieuDai td ON sk.trieu_dai_id = td.id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Chi tiết một sự kiện, kèm nhân vật liên quan
app.get('/api/su-kien/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT sk.*, td.ten_trieu_dai
       FROM SuKien sk
       LEFT JOIN TrieuDai td ON sk.trieu_dai_id = td.id
       WHERE sk.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
    }
    const [nhanVat] = await pool.query(
      `SELECT nv.id, nv.ho_ten, nvsk.vai_tro
       FROM NhanVat_SuKien nvsk
       JOIN NhanVat nv ON nvsk.nhan_vat_id = nv.id
       WHERE nvsk.su_kien_id = ?`,
      [req.params.id]
    );
    res.json({ ...rows[0], nhan_vat: nhanVat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Backend Lịch sử Việt Nam đang chạy' });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Backend đang chạy tại http://localhost:${PORT}`);
});
