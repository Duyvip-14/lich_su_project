# Cơ sở dữ liệu

## Chạy lần đầu

Chạy `schema.sql` trước để tạo database và bảng, sau đó chạy `seed.sql` để thêm dữ liệu mẫu. Hai file này an toàn khi chạy lại: schema không xóa bảng; seed không xóa dữ liệu hiện có.

```powershell
docker cp .\database\schema.sql lich-su-mysql:/tmp/schema.sql
docker exec -it lich-su-mysql mysql -u root -p -e "source /tmp/schema.sql"
docker cp .\database\seed.sql lich-su-mysql:/tmp/seed.sql
docker exec -it lich-su-mysql mysql -u root -p -e "source /tmp/seed.sql"
```

## Đặt lại dữ liệu phát triển

`reset_dev.sql` **nguy hiểm**: chỉ dùng trong môi trường phát triển, vì nó xóa các bảng và toàn bộ dữ liệu. Nếu chủ động đặt lại database, chạy theo thứ tự `reset_dev.sql`, `schema.sql`, rồi `seed.sql`:

```powershell
docker cp .\database\reset_dev.sql lich-su-mysql:/tmp/reset_dev.sql
docker exec -it lich-su-mysql mysql -u root -p -e "source /tmp/reset_dev.sql"
docker cp .\database\schema.sql lich-su-mysql:/tmp/schema.sql
docker exec -it lich-su-mysql mysql -u root -p -e "source /tmp/schema.sql"
docker cp .\database\seed.sql lich-su-mysql:/tmp/seed.sql
docker exec -it lich-su-mysql mysql -u root -p -e "source /tmp/seed.sql"
```

Mỗi lệnh `mysql` sẽ hỏi mật khẩu root trong terminal.
