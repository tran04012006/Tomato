# 🍅 Pomato — Pomodoro · To-Do · Study Together

Web app MERN + Socket.IO. Giao diện lấy từ prototype Pomato (cà chua đỏ + xanh lá, font Baloo 2 / Nunito).

| Lớp | Công nghệ |
| --- | --- |
| Frontend | React 18 (Vite), JavaScript, Bootstrap 5, React Router 6, Axios, socket.io-client |
| Backend | Node.js, Express, Socket.IO, JWT (cookie httpOnly), bcrypt |
| Database | MongoDB, Mongoose |

## Tính năng
1. **Login / Logout** — đăng ký, đăng nhập, JWT lưu trong cookie httpOnly (7 ngày), mật khẩu băm bằng bcrypt.
2. **Pomodoro** — 25 phút focus / 5 phút nghỉ ngắn / 15 phút nghỉ dài, đếm số tomato mỗi ngày, chọn task đang làm và đánh dấu xong.
3. **To-Do** — thêm / sửa trạng thái / xóa / lọc, lưu trong MongoDB theo từng user.
4. **Study Together** — 5 phòng học, tối đa 10 người/phòng, chat realtime, danh sách người trong phòng, lưu 50 tin nhắn gần nhất.

## Cấu trúc thư mục

```
pomato/
├── package.json            # script chạy chung (dev, seed, build)
├── server/
│   ├── server.js           # entry: HTTP + Socket.IO + kết nối MongoDB
│   ├── .env.example
│   └── src/
│       ├── app.js          # Express app, mount routes
│       ├── seed.js         # tạo 5 phòng mẫu
│       ├── models/         # User, Todo, Room, Message
│       ├── middleware/     # auth.js (JWT, requireAuth)
│       ├── routes/         # auth.js, todos.js, rooms.js
│       └── socket/         # index.js (events), presence.js (ai đang trong phòng)
└── client/
    ├── vite.config.js      # proxy /api và /socket.io -> localhost:5000
    └── src/
        ├── main.jsx, App.jsx        # React Router
        ├── api/axios.js, socket.js
        ├── context/AuthContext.jsx  # user, login, register, logout
        ├── components/              # AppNavbar, ProtectedRoute
        ├── pages/                   # Login, Register, Pomodoro, Todo, Rooms, Room
        └── styles/pomato.css
```

## Chạy lần đầu

Yêu cầu: Node.js 18+, MongoDB (cài local hoặc dùng MongoDB Atlas miễn phí).

```bash
git clone <url-repo> && cd pomato
npm install                       # cài concurrently ở thư mục gốc
npm run install:all               # cài server + client
cp server/.env.example server/.env   # rồi mở server/.env và sửa JWT_SECRET (+ MONGO_URI nếu dùng Atlas)
npm run seed                      # tạo 5 phòng học mẫu
npm run dev                       # chạy server (5000) + client (5173)
```

Mở http://localhost:5173, đăng ký tài khoản và dùng thử. Mở thêm cửa sổ ẩn danh với tài khoản thứ hai để thử chat realtime.

> Mỗi người trong nhóm cần MongoDB riêng (local) **hoặc** dùng chung 1 cluster Atlas (khi đó dữ liệu test sẽ lẫn nhau). Không commit file `.env`.

## API

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| POST | `/api/auth/register` | `{name, email, password}` |
| POST | `/api/auth/login` | `{email, password}` |
| POST | `/api/auth/logout` | xóa cookie |
| GET | `/api/auth/me` | user hiện tại |
| GET/POST | `/api/todos` | danh sách / tạo task |
| PATCH/DELETE | `/api/todos/:id` | cập nhật `done`/`text` / xóa |
| GET | `/api/rooms` | danh sách phòng + số người đang online |

Socket.IO (client → server): `room:join {roomId}`, `room:leave`, `chat:send {text}`, `status:update {status, min}`
Socket.IO (server → client): `room:joined`, `room:presence`, `chat:message`, `room:error`

## Làm việc nhóm 2 người với GitHub

### Thiết lập một lần
1. **Người A** tạo repo trên GitHub (private cũng được), **không** tick "Add README".
2. Người A đẩy code lên:
   ```bash
   cd pomato
   git init
   git add .
   git commit -m "chore: initial skeleton"
   git branch -M main
   git remote add origin https://github.com/<A>/pomato.git
   git push -u origin main
   ```
3. Repo → **Settings → Collaborators → Add people** → mời **người B**. B nhận email và chấp nhận lời mời.
4. (Khuyến nghị) Repo → **Settings → Branches → Add rule** cho `main`: bắt buộc Pull Request, cần 1 người review trước khi merge.
5. Người B clone: `git clone https://github.com/<A>/pomato.git`, rồi làm theo phần "Chạy lần đầu".

### Quy trình hằng ngày (cả hai đều làm)
```bash
git checkout main && git pull                 # luôn cập nhật trước khi làm
git checkout -b feature/ten-tinh-nang         # mỗi tính năng 1 nhánh
# ...code...
git add . && git commit -m "feat: mô tả ngắn"
git push -u origin feature/ten-tinh-nang
```
Sau đó lên GitHub → **Compare & pull request** → người còn lại review → **Merge** → xóa nhánh. Cả hai quay về `git checkout main && git pull`.

Quy ước commit: `feat:` tính năng mới · `fix:` sửa lỗi · `style:` giao diện · `docs:` tài liệu · `chore:` việc vặt.

Khi bị **conflict**: `git checkout main && git pull`, quay lại nhánh của bạn, chạy `git merge main`, sửa các đoạn `<<<<<<<` trong file, `git add .`, `git commit`, push lại.

### Gợi ý chia việc
| Người | Phụ trách | Thư mục chính |
| --- | --- | --- |
| **A — Backend** | auth, todos, rooms, socket, seed, bảo mật, deploy server | `server/` |
| **B — Frontend** | giao diện, các trang, responsive, kết nối API/socket | `client/src/` |

Hai người thống nhất trước về **API/socket contract** (bảng phía trên). Khi cần đổi API, báo cho nhau và cập nhật README.

## Việc nên làm tiếp (gợi ý)
- Đồng bộ trạng thái Focusing/On break từ trang Pomodoro vào phòng (server đã có sự kiện `status:update`).
- Hiển thị ngày tạo task, sửa nội dung task, kéo thả sắp xếp.
- Rate limit cho `/api/auth/*` (`express-rate-limit`) và `helmet` trước khi deploy.
- Deploy: frontend lên Vercel/Netlify, backend lên Render/Railway, database trên MongoDB Atlas; khi tách domain cần đặt cookie `sameSite: 'none'` + `secure: true` và cấu hình `CLIENT_ORIGIN`.
- Viết test (Vitest cho client, Jest/Supertest cho server).
