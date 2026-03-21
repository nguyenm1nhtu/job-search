# BotCV - Job Search Platform

Monorepo cho nền tảng tìm việc gồm:

- `client`: Next.js (App Router) cho giao diện ứng viên/nhà tuyển dụng.
- `server`: Express + PostgreSQL cho API xác thực, việc làm, ứng tuyển, hồ sơ, lịch phỏng vấn.

## 1. Tong quan

Project triển khai các nhóm chức năng chính:

- Đăng ký/đăng nhập theo vai trò `candidate` và `recruiter`.
- Tìm kiếm việc làm theo từ khóa, ngành nghề, địa điểm, mức lương, kinh nghiệm.
- Xem chi tiết job, job liên quan, ứng tuyển bằng CV.
- Quản lý hồ sơ cá nhân ứng viên.
- Quản lý danh sách job yêu thích.
- Quản lý đơn ứng tuyển và lịch phỏng vấn.

## 2. Kien truc he thong

```text
job-search/
|-- client/                  # Next.js frontend (React 19, App Router)
|   |-- src/app/
|   |   |-- (routes)/        # Route pages
|   |   |-- Layout/          # UI sections (Header, Main, Search, JobDetail, Profile...)
|   |   |-- auth/            # Login/Register/Forgot password views
|   |   |-- api/             # Axios client config
|   |   |-- hooks/           # useAuth
|   |   `-- components/      # Reusable components
|   `-- public/              # Static assets
|
|-- server/                  # Express API
|   |-- app.js               # Express app + route mounting
|   |-- bin/www              # HTTP server bootstrap
|   |-- config/db.js         # PostgreSQL connection
|   |-- routes/              # API routes
|   |-- controllers/         # Controller layer
|   |-- models/              # Query/data access layer
|   |-- middlewares/         # Auth/role/validation/rate limit
|   |-- utils/               # JWT, mail, response helper
|   |-- uploads/             # Uploaded files (avatars, cvs)
|   `-- query.pgsql          # Script query/seed mẫu
|
`-- README.md
```

## 3. Cong nghe su dung

### Frontend (`client`)

- Next.js `^15.5.0`
- React `^19.0.0`
- Axios, React Select, React Paginate, React Slick, React Toastify
- Tailwind CSS `^4`

### Backend (`server`)

- Node.js + Express `^4.21.2`
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- Upload file (`multer`)
- Validation (`express-validator`)
- Rate limit (`express-rate-limit`)
- Mail (`nodemailer`)

## 4. Tinh nang theo vai tro

### Candidate

- Đăng ký/đăng nhập.
- Tìm kiếm và xem chi tiết việc làm.
- Ứng tuyển job bằng CV.
- Quản lý profile cá nhân.
- Quản lý CV (upload, đổi trạng thái, xóa).
- Quản lý job yêu thích.

### Recruiter

- Đăng ký recruiter kèm thông tin công ty.
- Tạo job, cập nhật trạng thái job.
- Xem và cập nhật trạng thái đơn ứng tuyển.
- Tạo/cập nhật/xóa lịch phỏng vấn.

## 5. Dieu kien chay local

- Node.js `>= 18`
- npm `>= 9`
- PostgreSQL `>= 14` (khuyến nghị)
